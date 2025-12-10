import clsx from 'clsx/lite'
import { twMerge } from 'tailwind-merge'

export function cn(
  ...classLists: (string | number | bigint | null | boolean | undefined)[]
): string {
  return twMerge(clsx(...classLists))
}
