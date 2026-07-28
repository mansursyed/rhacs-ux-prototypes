export type DateLike = string | number | Date;

export function getDateTime(dateLike: DateLike): string {
  const date =
    typeof dateLike === 'string' || typeof dateLike === 'number'
      ? new Date(dateLike)
      : dateLike;
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  }).format(date);
}
