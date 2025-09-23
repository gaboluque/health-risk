import { Access } from 'payload'

export const basePolicy: Record<string, Access> = {
  onlyAdmin: ({ req: { user } }) => {
    if (user?.role === 'admin') {
      return true
    }
    return false
  },
  adminOrSelf: ({ req: { user }, data }) => {
    if (user?.role === 'admin' || user?.id === data?.id) {
      return true
    }
    return false
  },
}
