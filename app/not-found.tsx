import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center justify-center gap-6 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-2">
            <div className="text-6xl font-bold">404</div>
            <CardTitle>Page not found</CardTitle>
            <CardDescription>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <p className="text-sm text-muted-foreground">
                Check the URL or head back to the dashboard to continue exploring salons.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/salons">
                <Search className="mr-2 h-4 w-4" />
                Explore
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
