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

interface AppointmentCancelledEmailProps {
  customerName: string
  salonName: string
  serviceName: string
  staffName: string
  appointmentDate: string
  appointmentTime: string
  cancellationReason?: string
  rebookUrl?: string
}

export function AppointmentCancelledEmail({
  customerName,
  salonName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  cancellationReason,
  rebookUrl,
}: AppointmentCancelledEmailProps) {
  const previewText = `Your appointment at ${salonName} has been cancelled`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Appointment Cancelled</Heading>

          <Text style={text}>
            Hi {customerName},
          </Text>

          <Text style={text}>
            Your appointment has been cancelled. Here are the details of the cancelled appointment:
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
              <strong>Original Date:</strong> {appointmentDate}
            </Text>
            <Text style={appointmentDetail}>
              <strong>Original Time:</strong> {appointmentTime}
            </Text>
            {cancellationReason && (
              <Text style={appointmentDetail}>
                <strong>Reason:</strong> {cancellationReason}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={text}>
              We apologize for any inconvenience. Would you like to book a new appointment?
            </Text>
            {rebookUrl && (
              <Button
                href={rebookUrl}
                style={button}
              >
                Book New Appointment
              </Button>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions about this cancellation, please contact {salonName} directly.
          </Text>

          <Text style={footer}>
            We hope to see you again soon!
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
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0 48px',
  margin: '30px 0',
}

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
  margin: '10px 0',
}

const appointmentBox = {
  backgroundColor: '#fef2f2',
  borderRadius: '8px',
  margin: '20px 48px',
  padding: '24px',
  border: '1px solid #fca5a5',
}

const appointmentDetail = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
}

const button = {
  backgroundColor: '#10b981',
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
  textAlign: 'center' as const,
}