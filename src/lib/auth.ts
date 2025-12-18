import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from './db'
import bcrypt from 'bcryptjs'

if (!process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET environment variable is required')
}

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET)

export interface UserSession {
  id: string
  email: string
  username: string
  name: string | null
  plan: string
}

export async function createToken(user: UserSession): Promise<string> {
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.user as UserSession
  } catch {
    return null
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function signUp(email: string, password: string, username: string, name?: string) {
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  })

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email already in use')
    }
    throw new Error('Username already taken')
  }

  const hashedPassword = await hashPassword(password)

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      username: username.toLowerCase(),
      name,
    },
  })

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    plan: user.plan,
  }
}

export async function signIn(email: string, password: string): Promise<UserSession> {
  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    plan: user.plan,
  }
}
