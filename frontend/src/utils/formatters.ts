export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getInitial = (name?: string): string => {
  if (!name || name.trim().length === 0) return 'M';
  return name.trim().charAt(0).toUpperCase();
};
