import { Alert } from 'react-native';
import { DashboardComponent } from '@airbnb/core-domain-models';
import { supabase } from './api';

export const dashboardLayoutService = {
  async getLayout(userId: string): Promise<DashboardComponent[]> {
    try {
      const { data, error } = await supabase
        .from('user_dashboard_layouts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && (error as any).code !== 'PGRST116') throw error;
      return (data?.components as DashboardComponent[]) || [];
    } catch (error) {
      console.error('[dashboardLayoutService.getLayout]', error);
      Alert.alert('Error', 'Could not load dashboard layout');
      return [];
    }
  },

  async saveLayout(
    userId: string,
    components: DashboardComponent[]
  ): Promise<void> {
    try {
      const { error } = await supabase.from('user_dashboard_layouts').upsert({
        user_id: userId,
        components,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error('[dashboardLayoutService.saveLayout]', error);
      Alert.alert('Error', 'Could not save dashboard layout');
      throw error;
    }
  },

  async addComponent(userId: string, componentType: string): Promise<void> {
    try {
      const currentLayout = await this.getLayout(userId);
      const newComponent: DashboardComponent = {
        id: Date.now().toString(),
        type: componentType as any,
        order: currentLayout.length,
      };
      await this.saveLayout(userId, [...currentLayout, newComponent]);
    } catch (error) {
      console.error('[dashboardLayoutService.addComponent]', error);
      throw error;
    }
  },

  async removeComponent(userId: string, componentId: string): Promise<void> {
    try {
      const currentLayout = await this.getLayout(userId);
      const filtered = currentLayout
        .filter(c => c.id !== componentId)
        .map((c, index) => ({ ...c, order: index }));
      await this.saveLayout(userId, filtered);
    } catch (error) {
      console.error('[dashboardLayoutService.removeComponent]', error);
      throw error;
    }
  },

  async reorderComponents(
    userId: string,
    components: DashboardComponent[]
  ): Promise<void> {
    try {
      const reordered = components.map((c, index) => ({ ...c, order: index }));
      await this.saveLayout(userId, reordered);
    } catch (error) {
      console.error('[dashboardLayoutService.reorderComponents]', error);
      throw error;
    }
  },
};
