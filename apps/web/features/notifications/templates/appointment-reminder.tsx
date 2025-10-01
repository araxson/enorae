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

interface AppointmentReminderEmailProps {
  customerName: string
  salonName: string
  serviceName: string
  staffName: string
  appointmentDate: string
  appointmentTime: string
  salonAddress?: string
  salonPhone?: string
  manageUrl?: string
}

export function AppointmentReminderEmail({
  customerName,
  salonName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  salonAddress,
  salonPhone,
  manageUrl,
}: AppointmentReminderEmailProps) {
  const previewText = `Reminder: Your appointment at ${salonName} is tomorrow at ${appointmentTime}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Appointment Reminder</Heading>

          <Text style={text}>
            Hi {customerName},
          </Text>

          <Text style={text}>
            This is a friendly reminder about your upcoming appointment tomorrow:
          </Text>

          <Section style={appointmentBox}>
            <Text style={appointmentDetail}>
              <strong>When:</strong> {appointmentDate} at {appointmentTime}
            </Text>
            <Text style={appointmentDetail}>
              <strong>Where:</strong> {salonName}
            </Text>
            <Text style={appointmentDetail}>
              <strong>Service:</strong> {serviceName}
            </Text>
            <Text style={appointmentDetail}>
              <strong>With:</strong> {staffName}
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
              Need to reschedule or cancel?
            </Text>
            {manageUrl && (
              <Button
                href={manageUrl}
                style={button}
              >
                Manage Appointment
              </Button>
            )}
            <Text style={smallText}>
              Please provide at least 24 hours notice for cancellations.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            We look forward to seeing you tomorrow at {salonName}!
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

const smallText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '0 48px',
  margin: '10px 0',
  textAlign: 'center' as const,
}

const appointmentBox = {
  backgroundColor: '#f0f7ff',
  borderRadius: '8px',
  margin: '20px 48px',
  padding: '24px',
  border: '2px solid #3b82f6',
}

const appointmentDetail = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
}

const button = {
  backgroundColor: '#3b82f6',
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