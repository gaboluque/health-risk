import { redirect } from 'next/navigation'

export default function ClientPage() {
  // Redirect to login page
  redirect('/client/login')
}
