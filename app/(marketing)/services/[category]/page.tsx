import {
  MarketingServicesCategoryPage,
  generateServicesCategoryMetadata,
} from '@/features/marketing/services-directory'

export { generateServicesCategoryMetadata as generateMetadata }

type PageProps = Parameters<typeof MarketingServicesCategoryPage>[0]

export default async function ServiceCategoryPage(props: PageProps) {
  return <MarketingServicesCategoryPage {...props} />
}
