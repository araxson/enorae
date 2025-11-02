'use server'

import { randomInt } from 'crypto'

const CONFIRMATION_CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // Exclude I, O to avoid confusion with 1, 0
const CONFIRMATION_CODE_NUMBERS = '0123456789'
const CONFIRMATION_CODE_LETTER_COUNT = 3
const CONFIRMATION_CODE_NUMBER_COUNT = 4
const CONFIRMATION_CODE_SEPARATOR = '-'

/**
 * Generate a unique confirmation code in format ABC-1234
 */
function generateConfirmationCode(): string {
  let code = ''
  for (let i = 0; i < CONFIRMATION_CODE_LETTER_COUNT; i++) {
    code += CONFIRMATION_CODE_LETTERS[randomInt(0, CONFIRMATION_CODE_LETTERS.length)]
  }
  code += CONFIRMATION_CODE_SEPARATOR
  for (let i = 0; i < CONFIRMATION_CODE_NUMBER_COUNT; i++) {
    code += CONFIRMATION_CODE_NUMBERS[randomInt(0, CONFIRMATION_CODE_NUMBERS.length)]
  }

  return code
}
