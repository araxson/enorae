import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface AppointmentConfirmationEmailProps {
  customerName: string
  salonName: string
  serviceName: string
  staffName: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  price: number
  salonAddress?: string
  salonPhone?: string
  cancellationUrl?: string
}

export function AppointmentConfirmationEmail({
  customerName,
  salonName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  duration,
  price,
  salonAddress,
  salonPhone,
  cancellationUrl,
}: AppointmentConfirmationEmailProps) {
  const previewText = `Your appointment at ${salonName} is confirmed for ${appointmentDate} at ${appointmentTime}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Appointment Confirmed!</Heading>

          <Text style={text}>
            Hi {customerName},
          </Text>

          <Text style={text}>
            Your appointment has been successfully booked. Here are the details:
          </Text>

          <Section style={appointmentBox}>
            <Text style={appointmentDetail}>
              <strong>Salon:</strong> {salonName}
            </Text>
            <Text style={appointmentDetail}>
              <strong>Service:</strong> {serviceName}
            </Text>
            <Text style={appointmentDetail}>
              <strong>Staff:</strong> {staffName}
            </Text>
            <Text style={appointmentDetail}>
              <strong>Date:</strong> {appointmentDate}
            </Text>
            <Text style={appointmentDetail}>
              <strong>Time:</strong> {appointmentTime}
            </Text>
            <Text style={appointmentDetail}>
              <strong>Duration:</strong> {duration} minutes
            </Text>
            <Text style={appointmentDetail}>
              <strong>Price:</strong> ${price.toFixed(2)}
            </Text>
          </Section>

          {salonAddress && (
            <Section>
              <Heading style={h2}>Location</Heading>
              <Text style={text}>{salonAddress}</Text>
              {salonPhone && (
                <Text style={text}>Phone: {salonPhone}</Text>
              )}
            </Section>
          )}

          <Hr style={hr} />

          <Section>
            <Text style={text}>
              Need to make changes to your appointment?
            </Text>
            {cancellationUrl && (
              <Button
                href={cancellationUrl}
                style={button}
              >
                Manage Appointment
              </Button>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Thank you for choosing {salonName}. We look forward to seeing you!
          </Text>

          <Text style={footer}>
            If you have any questions, please contact the salon directly.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0 48px',
  margin: '30px 0',
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  padding: '0 48px',
  margin: '20px 0 10px',
}

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
  margin: '10px 0',
}

const appointmentBox = {
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  margin: '20px 48px',
  padding: '24px',
}

const appointmentDetail = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
}

const button = {
  backgroundColor: '#000',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '14px',
  margin: '20px auto',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 48px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '18px',
  padding: '0 48px',
  margin: '5px 0',
}