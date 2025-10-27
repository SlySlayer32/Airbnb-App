import { ComponentLibraryItem, UserRole } from '@airbnb/core-models';

// Component Library Constants
export const COMPONENT_LIBRARY: ComponentLibraryItem[] = [
  {
    type: 'stats',
    name: 'Dashboard Stats',
    description: 'Key metrics and statistics',
    icon: 'stats-chart',
    color: '#007AFF',
    allowedRoles: ['property_owner', 'cleaner', 'co_host'],
  },
  {
    type: 'todayJobs',
    name: "Today's Jobs",
    description: 'Cleaning sessions scheduled for today',
    icon: 'calendar-outline',
    color: '#10b981',
    allowedRoles: ['cleaner', 'co_host'],
  },
  {
    type: 'quickActions',
    name: 'Quick Actions',
    description: 'Common tasks and shortcuts',
    icon: 'flash-outline',
    color: '#f59e0b',
    allowedRoles: ['property_owner', 'cleaner', 'co_host'],
  },
  {
    type: 'todoTasks',
    name: 'To-Do Tasks',
    description: 'Personal task checklist',
    icon: 'checkmark-circle-outline',
    color: '#8b5cf6',
    allowedRoles: ['cleaner', 'co_host'],
  },
  {
    type: 'activity',
    name: 'Recent Activity',
    description: 'Latest updates and changes',
    icon: 'list-outline',
    color: '#6b7280',
    allowedRoles: ['property_owner', 'co_host'],
  },
  {
    type: 'calendar',
    name: 'Calendar',
    description: 'Upcoming scheduled events',
    icon: 'calendar',
    color: '#ef4444',
    allowedRoles: ['property_owner', 'cleaner', 'co_host'],
  },
];

export const getComponentsForRole = (role: string) => {
  return COMPONENT_LIBRARY.filter(item =>
    item.allowedRoles.includes(role as UserRole)
  );
};
