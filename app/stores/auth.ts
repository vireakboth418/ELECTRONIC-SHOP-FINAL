import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type Account = { 
  id?: number | string; 
  firstName: string; 
  lastName: string; 
  name: string; 
  email: string; 
  password: string 
}

type SignedInUser = Omit<Account, 'password'>

const SESSION_KEY = 'nuxt-first-session'
const API_BASE = 'http://localhost:8000'
const USERS_ENDPOINT = `${API_BASE}/users`

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

  function startSession(account: Account) {
    const { password: _password, ...signedInUser } = account
    user.value = signedInUser
    localStorage.setItem(SESSION_KEY, JSON.stringify(user.value))
  }

  async function register(firstName: string, lastName: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()

    const existingResponse = await fetch(
      `${USERS_ENDPOINT}?email=${encodeURIComponent(normalizedEmail)}`
    )

    if (!existingResponse.ok) {
      throw new Error('Unable to check existing accounts.')
    }

    const existingAccounts = await existingResponse.json() as Account[]

    if (existingAccounts.length > 0) {
      throw new Error('An account with this email already exists.')
    }

    const cleanFirstName = firstName.trim()
    const cleanLastName = lastName.trim()

    const account = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      name: `${cleanFirstName} ${cleanLastName}`,
      email: normalizedEmail,
      password
    }

    const response = await fetch(USERS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    })

    if (!response.ok) {
      throw new Error('Unable to create your account.')
    }

    const newAccount = await response.json() as Account
    startSession(newAccount)
  }

  async function login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const response = await fetch(`${USERS_ENDPOINT}?email=${encodeURIComponent(normalizedEmail)}`)
    if (!response.ok) throw new Error('Unable to log in.')

    const accounts = await response.json() as Account[]
    const account = accounts.find((item) => item.password === password)
    if (!account) throw new Error('Incorrect email or password.')
    startSession(account)
  }

  function logout() { 
    user.value = null 
    localStorage.removeItem(SESSION_KEY) 
  }

  return { user, isReady, isAuthenticated, initialize, register, login, logout }
})