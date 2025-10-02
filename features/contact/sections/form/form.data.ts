export const formData = {
  title: 'Send us a Message',
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'John Doe',
      required: true,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john@example.com',
      required: true,
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      placeholder: 'How can we help?',
      required: true,
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Tell us more about your inquiry...',
      required: true,
    },
  ],
  submitText: 'Send Message',
} as const
