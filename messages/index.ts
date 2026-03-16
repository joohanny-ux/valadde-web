import { en } from './en'
import { ko } from './ko'
import { zh } from './zh'

export const messages = {
  ko,
  en,
  zh,
} as const

export type MessageLocale = keyof typeof messages

export function getMessages<T extends MessageLocale>(locale: T): (typeof messages)[T]
export function getMessages(locale: MessageLocale = 'ko') {
  return messages[locale]
}
