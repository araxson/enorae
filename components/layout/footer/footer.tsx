import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Container, Grid, Stack, Flex } from '@/components/layout'
import { Sparkles, Mail, MapPin, Phone } from 'lucide-react'
import { NewsletterForm } from '@/components/marketing'

const footerLinks = {
  product: [
    { href: '/explore', label: 'Explore Salons' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
  resources: [
    { href: '/signup', label: 'Get Started' },
    { href: '/login', label: 'Sign In' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40">
      <Container>
        <Stack gap="xl" className="py-12">
          {/* Newsletter Section */}
          <div className="max-w-2xl mx-auto text-center">
            <NewsletterForm
              title="Stay in the Loop"
              description="Get beauty tips, exclusive offers, and the latest salon updates"
              inline
            />
          </div>

          <Separator />

          {/* Main Footer Content */}
          <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="lg">
            {/* Brand Section */}
            <Stack gap="md">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Enorae
                </span>
              </Link>
              <p className="leading-7 text-sm text-muted-foreground">
                Your Beauty Appointments, Simplified. The modern platform connecting clients with premier salons.
              </p>
              <Stack gap="xs">
                <Flex gap="xs" align="center">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <small className="text-sm font-medium leading-none text-muted-foreground">support@enorae.com</small>
                </Flex>
                <Flex gap="xs" align="center">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <small className="text-sm font-medium leading-none text-muted-foreground">1-800-ENORAE</small>
                </Flex>
                <Flex gap="xs" align="center">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <small className="text-sm font-medium leading-none text-muted-foreground">San Francisco, CA</small>
                </Flex>
              </Stack>
            </Stack>

            {/* Product Links */}
            <Stack gap="md">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-sm font-semibold">Product</h3>
              <Stack gap="xs">
                {footerLinks.product.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Stack>

            {/* Company Links */}
            <Stack gap="md">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-sm font-semibold">Company</h3>
              <Stack gap="xs">
                {footerLinks.company.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Stack>

            {/* Legal & Resources */}
            <Stack gap="md">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-sm font-semibold">Legal</h3>
              <Stack gap="xs">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
              <Stack gap="xs" className="mt-4">
                {footerLinks.resources.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Separator />

          {/* Bottom Footer */}
          <Flex
            justify="between"
            align="center"
            className="flex-col md:flex-row gap-4"
          >
            <p className="text-sm text-muted-foreground text-sm">
              © {currentYear} Enorae. All rights reserved.
            </p>
            <Flex gap="md">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <small className="text-sm font-medium leading-none">Twitter</small>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <small className="text-sm font-medium leading-none">Instagram</small>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <small className="text-sm font-medium leading-none">LinkedIn</small>
              </Link>
            </Flex>
          </Flex>
        </Stack>
      </Container>
    </footer>
  )
}
