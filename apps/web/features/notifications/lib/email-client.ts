import { Resend } from 'resend'

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  react: React.ReactElement
  from?: string
}

export async function sendEmail({ to, subject, react, from }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: from || 'Enorae <notifications@enorae.com>',
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}