import { format } from 'date-fns';
import { TZDate } from '@date-fns/tz';

export function formatMonth(value: string): string {
  return format(new TZDate(`${value}-01T00:00:00Z`, 'UTC'), 'MMMM yyyy');
}
