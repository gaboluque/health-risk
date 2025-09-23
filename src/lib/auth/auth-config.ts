/**
 * Authentication configuration and utility functions
 * These are client-side utilities that don't require server actions
 */

/**
 * Get role-specific redirect paths
 */
export function getRoleRedirectPaths(role: 'admin' | 'client' | 'user') {
  const paths = {
    admin: {
      login: '/admin', // PayloadCMS admin login
      dashboard: '/admin',
      unauthorized: '/',
    },
    client: {
      login: '/client-login',
      dashboard: '/client',
      unauthorized: '/',
    },
    user: {
      login: '/user-login',
      dashboard: '/user',
      unauthorized: '/',
    },
  }

  return paths[role]
}

/**
 * Check if user has access to a specific role's routes
 * This is a client-side utility function
 */
export function getRoleAccessInfo(
  userRole: string | undefined,
  requiredRole: 'admin' | 'client' | 'user',
): boolean {
  return userRole === requiredRole
}
