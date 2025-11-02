import 'server-only'
import { randomInt } from 'crypto'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'
import {
  CONFIRMATION_CODE_LETTERS,
  CONFIRMATION_CODE_NUMBERS,
  CONFIRMATION_CODE_LETTER_COUNT,
  CONFIRMATION_CODE_NUMBER_COUNT,
  CONFIRMATION_CODE_SEPARATOR
} from '@/lib/constants/confirmation-code'

/**
 * Generate a unique confirmation code in format ABC-1234
 * @returns A confirmation code in format ABC-1234
 */
export function generateConfirmationCode(): string {
  let code = ''

  // Generate letter part
  for (let letterIndex = 0; letterIndex < CONFIRMATION_CODE_LETTER_COUNT; letterIndex++) {
    code += CONFIRMATION_CODE_LETTERS[randomInt(0, CONFIRMATION_CODE_LETTERS.length)]
  }

  code += CONFIRMATION_CODE_SEPARATOR

  // Generate number part
  for (let numberIndex = 0; numberIndex < CONFIRMATION_CODE_NUMBER_COUNT; numberIndex++) {
    code += CONFIRMATION_CODE_NUMBERS[randomInt(0, CONFIRMATION_CODE_NUMBERS.length)]
  }

  return code
}
