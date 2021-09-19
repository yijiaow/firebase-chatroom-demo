import { formatRelative } from 'date-fns';

export const formatDate = (date) => {
  const relativeDate = formatRelative(date, new Date());

  return relativeDate.charAt(0).toUpperCase() + relativeDate.slice(1);
};
