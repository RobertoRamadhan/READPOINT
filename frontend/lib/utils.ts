// Utility functions for common UI patterns

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'hard': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getDifficultyVariant = (difficulty: string): 'success' | 'danger' | 'secondary' => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'success';
    case 'medium': return 'secondary';
    case 'hard': return 'danger';
    default: return 'secondary';
  }
};

export const getRoleIcon = (role: string): string => {
  switch (role) {
    case 'admin': return '⚙️';
    case 'guru': return '👨‍🏫';
    case 'siswa': return '👨‍🎓';
    default: return '👤';
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending': return '⏳';
    case 'approved': return '✅';
    case 'rejected': return '❌';
    case 'completed': return '✅';
    case 'active': return '🟢';
    case 'inactive': return '🔴';
    default: return '📋';
  }
};

export const getStatusVariant = (status: string): 'success' | 'danger' | 'secondary' => {
  switch (status.toLowerCase()) {
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    case 'completed': return 'success';
    case 'active': return 'success';
    case 'inactive': return 'secondary';
    case 'pending': return 'secondary';
    default: return 'secondary';
  }
};

export const getTypeIcon = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'earned': return '�';
    case 'spent': return '📉';
    case 'redeemed': return '🎁';
    case 'bonus': return '🎁';
    case 'penalty': return '⚠️';
    case 'reading': return '📚';
    case 'quiz': return '❓';
    default: return '📊';
  }
};

export const getTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'earned': return 'from-green-400 to-green-600';
    case 'spent': return 'from-red-400 to-red-600';
    case 'bonus': return 'from-blue-400 to-blue-600';
    case 'penalty': return 'from-yellow-400 to-yellow-600';
    default: return 'from-gray-400 to-gray-600';
  }
};

export const getTypeBadge = (type: string): 'success' | 'danger' | 'primary' | 'warning' | 'secondary' => {
  switch (type.toLowerCase()) {
    case 'earned': return 'success';
    case 'spent': return 'danger';
    case 'bonus': return 'primary';
    case 'penalty': return 'warning';
    default: return 'secondary';
  }
};

export const formatDate = (date: string | Date, locale: string = 'id-ID'): string => {
  return new Date(date).toLocaleDateString(locale);
};

export const formatDateTime = (date: string | Date, locale: string = 'id-ID'): string => {
  return new Date(date).toLocaleString(locale);
};

export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};
