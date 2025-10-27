export const questionsData = {
  title: 'Common Questions',
  categories: [
    {
      name: 'For Customers',
      questions: [
        {
          q: 'How do I book an appointment?',
          a: 'Browse salons, select a service, choose a time slot, and confirm your booking. It takes less than 2 minutes!',
        },
        {
          q: 'Can I cancel or reschedule?',
          a: 'Yes! You can cancel or reschedule appointments from your profile. Note that some salons may have cancellation policies.',
        },
        {
          q: 'Is there a booking fee?',
          a: 'No, booking through Enorae is completely free for customers.',
        },
      ],
    },
    {
      name: 'For Salons',
      questions: [
        {
          q: 'How much does Enorae cost?',
          a: 'Plans start at $29/month with a 14-day free trial. No setup fees or hidden charges.',
        },
        {
          q: 'How do I manage my schedule?',
          a: 'Use our business dashboard to view appointments, manage staff schedules, and track availability in real-time.',
        },
        {
          q: 'Can I customize my services and pricing?',
          a: 'Absolutely! You have full control over your services, pricing, staff assignments, and operating hours.',
        },
      ],
    },
  ],
} as const
