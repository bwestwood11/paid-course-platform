import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function format(
  date: Date | string | number | null | undefined,
  format = "DD",
) {
  if (!date) return undefined;
  if (typeof date === "string") return DateTime.fromISO(date).toFormat(format);
  if (typeof date === "number")
    return DateTime.fromMillis(date).toFormat(format);
  return DateTime.fromJSDate(date).toFormat(format);
}

export function getPagination<T>(
  data: T[],
  limit: number,
  field: keyof T,
) {
  const hasNextPage = data.length === limit;
  const nextCursor = hasNextPage 
    ? (data[data.length - 1]?.[field] as string) 
    : undefined;

  return {
    hasNextPage,
    nextCursor,
  };
}