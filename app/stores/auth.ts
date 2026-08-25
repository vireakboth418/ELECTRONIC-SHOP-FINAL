import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type Account = { name: string; email: string; password: string }
type SignedInUser = Pick<Account, 'name' | 'email'>
const ACCOUNTS_KEY = 'nuxt-first-accounts'
const SESSION_KEY = 'nuxt-first-session'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SignedInUser | null>(null)
  const isReady = ref(false)
  const isAuthenticated = computed(() => user.value !== null)

  function initialize() {
    if (!import.meta.client || isReady.value) return
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      try { user.value = JSON.parse(session) } catch { localStorage.removeItem(SESSION_KEY) }
    }
    isReady.value = true
  }

  function accounts(): Account[] {
    const saved = localStorage.getItem(ACCOUNTS_KEY)
    return saved ? JSON.parse(saved) : []
  }

  function startSession(account: Account) {
    user.value = { name: account.name, email: account.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user.value))
  }

  function register(name: string, email: string, password: string) {
    const all = accounts()
    const normalizedEmail = email.trim().toLowerCase()
    if (all.some((account) => account.email === normalizedEmail)) throw new Error('An account with this email already exists.')
    const account = { name: name.trim(), email: normalizedEmail, password }
    all.push(account)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(all))
    startSession(account)
  }

  function login(email: string, password: string) {
    const account = accounts().find((item) => item.email === email.trim().toLowerCase() && item.password === password)
    if (!account) throw new Error('Incorrect email or password.')
    startSession(account)
  }

  function logout() { user.value = null; localStorage.removeItem(SESSION_KEY) }

  return { user, isReady, isAuthenticated, initialize, register, login, logout }
})
