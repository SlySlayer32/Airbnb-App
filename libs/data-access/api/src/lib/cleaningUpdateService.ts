import { supabase } from './api';

export interface CleaningUpdate {
  id: string;
  cleaning_session_id: string;
  user_id: string;
  update_type:
    | 'status'
    | 'issue'
    | 'note'
    | 'completion'
    | 'arrival'
    | 'session_start'
    | 'session_pause'
    | 'session_resume'
    | 'session_complete';
  message: string;
  photo_urls?: string[] | undefined;
  requires_response: boolean;
  is_urgent: boolean;
  created_at: string;
  user_name?: string | undefined;
  user_role?: string | undefined;
}

export const cleaningUpdateService = {
  async addUpdate(
    sessionId: string,
    updateData: {
      update_type: CleaningUpdate['update_type'];
      message: string;
      photo_urls?: string[] | undefined;
      requires_response?: boolean | undefined;
      is_urgent?: boolean | undefined;
    }
  ): Promise<CleaningUpdate> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cleaning_updates')
      .insert({
        cleaning_session_id: sessionId,
        user_id: user.id,
        update_type: updateData.update_type,
        message: updateData.message,
        photo_urls: updateData.photo_urls || [],
        requires_response: updateData.requires_response || false,
        is_urgent: updateData.is_urgent || false,
        created_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        profiles (full_name, role)
      `
      )
      .single();

    if (error) throw error;

    if (updateData.requires_response || updateData.is_urgent) {
      await this.sendUpdateNotification(data as CleaningUpdate, sessionId);
    }

    return {
      ...(data as CleaningUpdate),
      user_name: (data as any).profiles?.full_name,
      user_role: (data as any).profiles?.role,
    };
  },

  async getSessionUpdates(sessionId: string): Promise<CleaningUpdate[]> {
    const { data, error } = await supabase
      .from('cleaning_updates')
      .select(
        `
        *,
        profiles (full_name, role)
      `
      )
      .eq('cleaning_session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((update: any) => ({
      ...update,
      user_name: update.profiles?.full_name,
      user_role: update.profiles?.role,
    }));
  },

  async reportIssue(
    sessionId: string,
    issueData: { message: string; photo_urls?: string[]; is_urgent?: boolean }
  ): Promise<CleaningUpdate> {
    return this.addUpdate(sessionId, {
      update_type: 'issue',
      message: issueData.message,
      photo_urls: issueData.photo_urls,
      requires_response: true,
      is_urgent: issueData.is_urgent || false,
    });
  },

  async addNote(
    sessionId: string,
    noteData: { message: string; photo_urls?: string[] }
  ): Promise<CleaningUpdate> {
    return this.addUpdate(sessionId, {
      update_type: 'note',
      message: noteData.message,
      photo_urls: noteData.photo_urls,
      requires_response: false,
      is_urgent: false,
    });
  },

  async recordSessionStart(
    sessionId: string,
    propertyName?: string
  ): Promise<CleaningUpdate> {
    return this.addUpdate(sessionId, {
      update_type: 'session_start',
      message: `Cleaning session started${propertyName ? ` at ${propertyName}` : ''}`,
      requires_response: false,
      is_urgent: false,
    });
  },

  async recordSessionPause(
    sessionId: string,
    reason?: string
  ): Promise<CleaningUpdate> {
    return this.addUpdate(sessionId, {
      update_type: 'session_pause',
      message: `Cleaning session paused${reason ? ` - ${reason}` : ''}`,
      requires_response: false,
      is_urgent: false,
    });
  },

  async recordSessionResume(sessionId: string): Promise<CleaningUpdate> {
    return this.addUpdate(sessionId, {
      update_type: 'session_resume',
      message: 'Cleaning session resumed',
      requires_response: false,
      is_urgent: false,
    });
  },

  async recordSessionComplete(
    sessionId: string,
    propertyName?: string,
    notes?: string
  ): Promise<CleaningUpdate> {
    const message = notes
      ? `Cleaning completed${propertyName ? ` at ${propertyName}` : ''} - ${notes}`
      : `Cleaning completed${propertyName ? ` at ${propertyName}` : ''}`;

    return this.addUpdate(sessionId, {
      update_type: 'session_complete',
      message,
      requires_response: false,
      is_urgent: false,
    });
  },

  async sendUpdateNotification(
    update: CleaningUpdate,
    sessionId: string
  ): Promise<void> {
    const { notificationService } = await import('./notificationService');

    const { data: session } = await supabase
      .from('cleaning_sessions')
      .select(
        `
        *,
        properties (owner_id, name),
        team_members (user_id)
      `
      )
      .eq('id', sessionId)
      .single();

    if (!session) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    let notifyUserId: string | undefined;

    if (user?.id === (session as any).team_members?.user_id) {
      notifyUserId = (session as any).properties?.owner_id;
    } else if (user?.id === (session as any).properties?.owner_id) {
      notifyUserId = (session as any).team_members?.user_id;
    }

    if (notifyUserId) {
      const priority = update.is_urgent
        ? 'urgent'
        : update.requires_response
          ? 'high'
          : 'normal';
      const title = update.is_urgent
        ? '🚨 Urgent Issue'
        : update.requires_response
          ? '⚠️ Issue Reported'
          : 'New Update';

      await notificationService.sendToUser(
        notifyUserId,
        `cleaning_update_${update.update_type}`,
        title,
        `${(session as any).properties?.name}: ${update.message}`,
        {
          cleaning_session_id: sessionId,
          update_id: update.id,
          priority: priority,
        }
      );
    }
  },
};
