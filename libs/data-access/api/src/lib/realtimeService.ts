import {
  CleaningSession,
  RealtimeConnectionState,
  RealtimeSubscriptionConfig,
} from '@airbnb/core-domain-models';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './api';

export class RealtimeService {
  private sessionChannel: RealtimeChannel | null = null;
  private updateChannel: RealtimeChannel | null = null;
  private config: RealtimeSubscriptionConfig | null = null;
  private connectionState: RealtimeConnectionState = {
    isConnected: false,
    reconnectAttempts: 0,
  };
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.setupConnectionListeners();
  }

  async subscribe(config: RealtimeSubscriptionConfig): Promise<void> {
    try {
      this.config = config;
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('User not authenticated');

      const { data: teamMember, error: teamError } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (teamError) {
        console.warn(
          'Could not get team member ID, subscribing broadly:',
          teamError
        );
      }

      await this.subscribeToSessions(teamMember?.id);
      await this.subscribeToUpdates(teamMember?.id);

      this.connectionState.isConnected = true;
      this.connectionState.lastConnected = new Date();
      this.connectionState.connectionError = undefined;
      this.connectionState.reconnectAttempts = 0;
    } catch (error) {
      console.error('Error establishing real-time subscriptions:', error);
      this.connectionState.isConnected = false;
      this.connectionState.connectionError =
        error instanceof Error ? error.message : 'Unknown error';
      this.scheduleReconnect();
      if (this.config?.onError) {
        this.config.onError(
          error instanceof Error
            ? error
            : new Error('Failed to establish real-time connection')
        );
      }
    }
  }

  private async subscribeToSessions(teamMemberId?: string): Promise<void> {
    if (this.sessionChannel) await this.sessionChannel.unsubscribe();

    this.sessionChannel = supabase
      .channel('cleaning_sessions_realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cleaning_sessions',
          filter: teamMemberId
            ? `assigned_cleaner_id=eq.${teamMemberId}`
            : undefined,
        },
        payload => {
          if (this.config?.onSessionUpdate && payload.new) {
            this.config.onSessionUpdate(payload.new as CleaningSession);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cleaning_sessions',
          filter: teamMemberId
            ? `assigned_cleaner_id=eq.${teamMemberId}`
            : undefined,
        },
        payload => {
          if (this.config?.onSessionInsert && payload.new) {
            this.config.onSessionInsert(payload.new as CleaningSession);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'cleaning_sessions',
          filter: teamMemberId
            ? `assigned_cleaner_id=eq.${teamMemberId}`
            : undefined,
        },
        payload => {
          if (this.config?.onSessionDelete && (payload.old as any)?.id) {
            this.config.onSessionDelete((payload.old as any).id as string);
          }
        }
      );

    await this.sessionChannel.subscribe();
  }

  private async subscribeToUpdates(_teamMemberId?: string): Promise<void> {
    if (this.updateChannel) await this.updateChannel.unsubscribe();

    this.updateChannel = supabase
      .channel('cleaning_updates_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cleaning_updates' },
        async payload => {
          if (payload.new?.cleaning_session_id && this.config?.onUpdateInsert) {
            try {
              this.config.onUpdateInsert(payload.new);
            } catch (error) {
              console.warn('Error handling update insert:', error);
            }
          }
        }
      );

    await this.updateChannel.subscribe();
  }

  async unsubscribe(): Promise<void> {
    try {
      if (this.sessionChannel) {
        await this.sessionChannel.unsubscribe();
        this.sessionChannel = null;
      }
      if (this.updateChannel) {
        await this.updateChannel.unsubscribe();
        this.updateChannel = null;
      }
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      this.connectionState.isConnected = false;
      this.config = null;
    } catch (error) {
      console.error('Error unsubscribing from real-time channels:', error);
    }
  }

  getConnectionState(): RealtimeConnectionState {
    return { ...this.connectionState };
  }

  private setupConnectionListeners(): void {
    // Supabase real-time client doesn't expose global connection listeners at this layer
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.connectionState.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.config?.onError)
        this.config.onError(new Error('Max reconnection attempts reached'));
      return;
    }
    this.connectionState.reconnectAttempts++;
    const delay =
      this.reconnectDelay *
      Math.pow(2, this.connectionState.reconnectAttempts - 1);
    this.reconnectTimeout = setTimeout(async () => {
      if (this.config) {
        try {
          await this.subscribe(this.config);
        } catch (error) {
          console.error('Reconnection attempt failed:', error);
        }
      }
    }, delay);
  }
}

export const realtimeService = new RealtimeService();
