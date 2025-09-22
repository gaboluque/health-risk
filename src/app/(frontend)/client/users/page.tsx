import { getPayload } from 'payload'
import config from '@/payload.config'
import { UsersDataTable } from '@/components/admin/UsersDataTable'

export default async function UsersPage() {
  const payload = await getPayload({ config })

  // Fetch users with pagination
  const usersResult = await payload.find({
    collection: 'users',
    limit: 50,
    sort: '-createdAt',
    where: {
      role: {
        equals: 'user',
      },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestionar usuarios del sistema y perfiles de pacientes
        </p>
      </div>

      <UsersDataTable users={usersResult.docs} />
    </div>
  )
}
