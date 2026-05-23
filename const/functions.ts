function getOrdinal(day: number): string {
  if (day > 3 && day < 21) return 'th';

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatDate(dateString: string, includeYear = false): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const day = date.getDate();
  const month = date.toLocaleString('en-IN', { month: 'long' });
  const year = date.getFullYear();

  const formattedDay = `${day}${getOrdinal(day)}`;

  return includeYear
    ? `${formattedDay} ${month} ${year}`
    : `${formattedDay} ${month}`;
}
