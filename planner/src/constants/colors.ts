export const COLORS = {
  // Status Colors
  NOT_STARTED: '#ef4444',
  PENDING: '#a855f7',
  IN_PROGRESS: '#3b82f6',
  COMPLETED: '#22c55e',

  // Priority Colors
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#10b981',

  // UI Colors
  PRIMARY: '#3b82f6',
  SECONDARY: '#6b7280',
  DANGER: '#ef4444',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',

  // Text Colors
  TEXT_PRIMARY: '#1f2937',
  TEXT_SECONDARY: '#4b5563',
  TEXT_LIGHT: '#6b7280',

  // Background Colors
  BG_PRIMARY: '#ffffff',
  BG_SECONDARY: '#f3f4f6',
  BG_DARK: '#0f172a',

  // Border Colors
  BORDER_LIGHT: '#e5e7eb',
  BORDER_DARK: 'rgba(255, 255, 255, 0.1)'
} as const;

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'NotStarted':
      return COLORS.NOT_STARTED;
    case 'Pending':
      return COLORS.PENDING;
    case 'StartedWorking':
      return COLORS.IN_PROGRESS;
    case 'Completed':
      return COLORS.COMPLETED;
    default:
      return COLORS.SECONDARY;
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'High':
      return COLORS.HIGH;
    case 'Medium':
      return COLORS.MEDIUM;
    case 'Low':
      return COLORS.LOW;
    default:
      return COLORS.SECONDARY;
  }
}; 