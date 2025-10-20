import {
  MessageThreadFeature,
  generateThreadMetadata,
} from '@/features/shared/messaging'

export { generateThreadMetadata as generateMetadata }

export default function Page(props: Parameters<typeof MessageThreadFeature>[0]) {
  return <MessageThreadFeature {...props} />
}
