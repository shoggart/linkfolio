import { NextRequest, NextResponse } from 'next/server'
import { signUp, createToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { emailSchema, passwordSchema, usernameSchema, nameSchema } from '@/lib/validation'

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  name: nameSchema.optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    const user = await signUp(
      validatedData.email,
      validatedData.password,
      validatedData.username,
      validatedData.name
    )

    const token = await createToken(user)

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
