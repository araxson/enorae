'use server'

import { randomInt } from 'crypto'
import { logError } from '@/lib/observability'

const CONFIRMATION_CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // Exclude I, O to avoid confusion with 1, 0
const CONFIRMATION_CODE_NUMBERS = '0123456789'
const CONFIRMATION_CODE_LETTER_COUNT = 3
const CONFIRMATION_CODE_NUMBER_COUNT = 4
const CONFIRMATION_CODE_SEPARATOR = '-'

/**
 * Generate a unique confirmation code in format ABC-1234
 *
 * Error scenarios:
 * - randomInt() fails (crypto module unavailable)
 * - String construction fails (memory issues)
 *
 * Recovery: Throws error to prevent booking with invalid confirmation code
 */
function generateConfirmationCode(): string {
  try {
    let code = ''

    // Generate letter portion with error handling
    for (let i = 0; i < CONFIRMATION_CODE_LETTER_COUNT; i++) {
      try {
        const index = randomInt(0, CONFIRMATION_CODE_LETTERS.length)
        code += CONFIRMATION_CODE_LETTERS[index]
      } catch (cryptoError) {
        logError('Failed to generate letter at position in confirmation code', {
          operationName: 'generateConfirmationCode',
          error: cryptoError instanceof Error ? cryptoError : String(cryptoError),
          errorCategory: 'system',
          position: i,
        })
        throw new Error(`Crypto operation failed during letter generation: ${cryptoError instanceof Error ? cryptoError.message : 'Unknown error'}`)
      }
    }

    code += CONFIRMATION_CODE_SEPARATOR

    // Generate number portion with error handling
    for (let i = 0; i < CONFIRMATION_CODE_NUMBER_COUNT; i++) {
      try {
        const index = randomInt(0, CONFIRMATION_CODE_NUMBERS.length)
        code += CONFIRMATION_CODE_NUMBERS[index]
      } catch (cryptoError) {
        logError('Failed to generate number at position in confirmation code', {
          operationName: 'generateConfirmationCode',
          error: cryptoError instanceof Error ? cryptoError : String(cryptoError),
          errorCategory: 'system',
          position: i,
        })
        throw new Error(`Crypto operation failed during number generation: ${cryptoError instanceof Error ? cryptoError.message : 'Unknown error'}`)
      }
    }

    // Validate generated code format
    if (code.length !== CONFIRMATION_CODE_LETTER_COUNT + 1 + CONFIRMATION_CODE_NUMBER_COUNT) {
      logError('Generated confirmation code has invalid length', {
        operationName: 'generateConfirmationCode',
        error: 'Invalid code length',
        errorCategory: 'validation',
        actualLength: code.length,
        expectedLength: CONFIRMATION_CODE_LETTER_COUNT + 1 + CONFIRMATION_CODE_NUMBER_COUNT,
      })
      throw new Error('Generated confirmation code has invalid length')
    }

    return code
  } catch (error) {
    logError('Fatal error generating confirmation code', {
      operationName: 'generateConfirmationCode',
      error: error instanceof Error ? error : String(error),
      errorCategory: 'system',
    })
    throw new Error(`Failed to generate confirmation code: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
