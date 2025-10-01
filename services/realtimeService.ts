import { supabase } from '@/lib/supabase';
import { CleaningSession } from '@/types';
import { RealtimeChannel, RealtimeClient } from '@supabase/supabase-js';

export interface RealtimeSubscriptionConfig {
  onSessionUpdate: (session: CleaningSession) => void;
  onSessionInsert: (session: CleaningSession) => void;
  onSessionDelete: (sessionId: string) => void;
  onUpdateInsert: (update: any) => void;
  onError?: (error: Error) => void;
}

export interface RealtimeConnectionState {
  isConnected: boolean;
  lastConnected?: Date;
  connectionError?: string;
  reconnectAttempts: number;
}

export class RealtimeService {
  private sessionChannel: RealtimeChannel | null = null;
  private updateChannel: RealtimeChannel | null = null;
  private config: RealtimeSubscriptionConfig | null = null;
  private connectionState: RealtimeConnectionState = {
    isConnected: false,
    reconnectAttempts: 0
  };
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor() {
    this.setupConnectionListeners();
  }

  /**
   * Subscribe to real-time updates for cleaning sessions and updates
   * @param config Configuration for handling real-time events
   * @param userId Optional user ID to filter sessions (if not provided, will get from auth)
   */
  async subscribe(config: RealtimeSubscriptionConfig): Promise<void> {
    try {
      this.config = config;
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Get user's team member ID for filtering
      const { data: teamMember, error: teamError } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (teamError) {
        console.warn('Could not get team member ID, subscribing to all sessions:', teamError);
      }

      // Subscribe to cleaning sessions
      await this.subscribeToSessions(teamMember?.id);
      
      // Subscribe to cleaning updates
      await this.subscribeToUpdates(teamMember?.id);

      this.connectionState.isConnected = true;
      this.connectionState.lastConnected = new Date();
      this.connectionState.connectionError = undefined;
      this.connectionState.reconnectAttempts = 0;

      console.log('Real-time subscriptions established successfully');
    } catch (error) {
      console.error('Error establishing real-time subscriptions:', error);
      this.connectionState.isConnected = false;
      this.connectionState.connectionError = error instanceof Error ? error.message : 'Unknown error';
      
      if (this.config?.onError) {
        this.config.onError(error instanceof Error ? error : new Error('Failed to establish real-time connection'));
      }
      
      // Attempt to reconnect
      this.scheduleReconnect();
    }
  }

  /**
   * Subscribe to cleaning sessions table changes
   */
  private async subscribeToSessions(teamMemberId?: string): Promise<void> {
    if (this.sessionChannel) {
      await this.sessionChannel.unsubscribe();
    }

    this.sessionChannel = supabase
      .channel('cleaning_sessions_realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cleaning_sessions',
          filter: teamMemberId ? `assigned_cleaner_id=eq.${teamMemberId}` : undefined
        },
        (payload) => {
          console.log('Session updated:', payload);
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
          filter: teamMemberId ? `assigned_cleaner_id=eq.${teamMemberId}` : undefined
        },
        (payload) => {
          console.log('New session created:', payload);
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
          filter: teamMemberId ? `assigned_cleaner_id=eq.${teamMemberId}` : undefined
        },
        (payload) => {
          console.log('Session deleted:', payload);
          if (this.config?.onSessionDelete && payload.old?.id) {
            this.config.onSessionDelete(payload.old.id as string);
          }
        }
      );

    await this.sessionChannel.subscribe();
  }

  /**
   * Subscribe to cleaning updates table changes
   */
  private async subscribeToUpdates(teamMemberId?: string): Promise<void> {
    if (this.updateChannel) {
      await this.updateChannel.unsubscribe();
    }

    // For updates, we need to subscribe to sessions the user is involved in
    // This is more complex, so we'll use a broader filter for now
    this.updateChannel = supabase
      .channel('cleaning_updates_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cleaning_updates'
        },
        async (payload) => {
          console.log('New update created:', payload);
          
          // Check if this update is relevant to the current user
          if (payload.new?.cleaning_session_id && this.config?.onUpdateInsert) {
            try {
              // Verify this update is for a session the user is involved in
              const { data: session } = await supabase
                .from('cleaning_sessions')
                .select('assigned_cleaner_id')
                .eq('id', payload.new.cleaning_session_id)
                .single();

              // For now, we'll include all updates - in a more sophisticated implementation,
              // we'd filter based on user relationships
              this.config.onUpdateInsert(payload.new);
            } catch (error) {
              console.warn('Error verifying update relevance:', error);
            }
          }
        }
      );

    await this.updateChannel.subscribe();
  }

  /**
   * Unsubscribe from all real-time channels
   */
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
      
      console.log('Real-time subscriptions unsubscribed');
    } catch (error) {
      console.error('Error unsubscribing from real-time channels:', error);
    }
  }

  /**
   * Get current connection state
   */
  getConnectionState(): RealtimeConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Setup connection state listeners
   */
  private setupConnectionListeners(): void {
    // Note: Supabase real-time client doesn't expose global connection listeners
    // Connection state will be tracked through individual channel subscriptions
    console.log('Real-time service initialized');
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.connectionState.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      if (this.config?.onError) {
        this.config.onError(new Error('Max reconnection attempts reached'));
      }
      return;
    }

    this.connectionState.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.connectionState.reconnectAttempts - 1); // Exponential backoff

    console.log(`Scheduling reconnection attempt ${this.connectionState.reconnectAttempts} in ${delay}ms`);

    this.reconnectTimeout = setTimeout(async () => {
      if (this.config) {
        console.log(`Attempting reconnection (${this.connectionState.reconnectAttempts}/${this.maxReconnectAttempts})`);
        try {
          await this.subscribe(this.config);
        } catch (error) {
          console.error('Reconnection attempt failed:', error);
        }
      }
    }, delay);
  }

  /**
   * Reset reconnection state (call when connection is restored)
   */
  private resetReconnectionState(): void {
    this.connectionState.reconnectAttempts = 0;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
