import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AnalyticsClient } from './analytics-client'

export default async function AnalyticsPage() {
  const session = await getSession()
  if (!session) redirect('/auth/signin')

  return <AnalyticsClient />
}
