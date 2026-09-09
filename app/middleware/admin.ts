import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const auth = useAuthStore()
  auth.initialize()

  const isAdmin = auth.user?.role === 'admin'
  if (!auth.isAuthenticated || !isAdmin) {
    return navigateTo('/login?redirect=/admin')
  }
})
