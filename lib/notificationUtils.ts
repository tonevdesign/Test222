/**
 * Format notification date with relative time for recent notifications
 */
export const formatNotificationDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Преди малко';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Less than 1 minute
    if (diffMins < 1) {
      return 'Преди малко';
    }

    // Less than 1 hour
    if (diffMins < 60) {
      return `Преди ${diffMins} ${diffMins === 1 ? 'минута' : 'минути'}`;
    }

    // Less than 24 hours
    if (diffHours < 24) {
      return `Преди ${diffHours} ${diffHours === 1 ? 'час' : 'часа'}`;
    }

    // Less than 7 days
    if (diffDays < 7) {
      return `Преди ${diffDays} ${diffDays === 1 ? 'ден' : 'дни'}`;
    }

    // More than 7 days - show full date
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: diffDays > 365 ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting notification date:', error);
    return 'Преди малко';
  }
};

/**
 * Get full formatted date for tooltips
 */
export const getFullNotificationDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return '';
  }
};