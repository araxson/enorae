'use server'

import { randomInt } from 'crypto'

/**
 * Generate a unique confirmation code in format ABC-1234
 */
export function generateConfirmationCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // Exclude I, O to avoid confusion with 1, 0
  const numbers = '0123456789'

  let code = ''
  for (let i = 0; i < 3; i++) {
    code += letters[randomInt(0, letters.length)]
  }
  code += '-'
  for (let i = 0; i < 4; i++) {
    code += numbers[randomInt(0, numbers.length)]
  }

  return code
}
