import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DATA_FILE = join(process.cwd(), 'app/api/api.json')

function readData() {
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
}

function writeData(data: Record<string, unknown>) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export default defineEventHandler(async (event) => {
  const method = event.method
  const query = getQuery(event)
  const email = typeof query.email === 'string' ? query.email : ''

  if (method === 'GET') {
    const data = readData()
    const users = (data.users as Array<{ id: number; name: string; email: string; password: string }>)
    if (email) {
      const normalizedEmail = email.trim().toLowerCase()
      return users.filter((u) => u.email.toLowerCase() === normalizedEmail)
    }
    return users
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const data = readData()
    const users = (data.users as Array<{ id: number; name: string; email: string; password: string }>)
    const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0)
    const newUser = { ...body, id: maxId + 1 } as { id: number; name: string; email: string; password: string }
    users.push(newUser)
    data.users = users
    writeData(data)
    return newUser
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
