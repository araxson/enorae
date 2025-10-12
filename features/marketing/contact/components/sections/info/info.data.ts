export const infoData = {
  title: 'Contact Information',
  email: 'support@enorae.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street, Suite 100, San Francisco, CA 94105',
  supportHours: [
    { label: 'Monday - Friday', value: '9:00 AM - 6:00 PM PST' },
    { label: 'Saturday', value: '10:00 AM - 4:00 PM PST' },
    { label: 'Sunday', value: 'Closed' },
  ],
  channels: [
    {
      title: 'Email',
      value: 'support@enorae.com',
      description: 'For general inquiries and support',
      icon: 'mail',
    },
    {
      title: 'Sales',
      value: 'sales@enorae.com',
      description: 'Interested in partnering with us?',
      icon: 'briefcase',
    },
    {
      title: 'Support',
      value: 'Available 24/7',
      description: 'Our support team is always here to help',
      icon: 'headphones',
    },
  ],
} as const
