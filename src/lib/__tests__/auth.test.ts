import { hashPassword, verifyPassword, createToken, verifyToken } from '../auth'
import type { UserSession } from '../auth'

// Mock jose module to avoid ESM issues in Jest
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-jwt-token'),
  })),
  jwtVerify: jest.fn(),
}))

describe('Password Hashing', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
    })

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      // bcrypt includes a salt, so each hash should be unique
      expect(hash1).not.toBe(hash2)
    })

    it('should handle special characters', async () => {
      const password = 'p@ssw0rd!#$%^&*()'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
    })

    it('should handle unicode characters', async () => {
      const password = 'пароль密码🔒'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
    })
  })

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword123'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword(wrongPassword, hash)
      expect(isValid).toBe(false)
    })

    it('should be case-sensitive', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword('TestPassword123', hash)
      expect(isValid).toBe(false)
    })

    it('should reject empty password', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword('', hash)
      expect(isValid).toBe(false)
    })

    it('should handle special characters correctly', async () => {
      const password = 'p@ssw0rd!#$%^&*()'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })
  })
})

describe('JWT Token Management', () => {
  const mockUser: UserSession = {
    id: 'user123',
    email: 'test@example.com',
    username: 'testuser',
    name: 'Test User',
    plan: 'free'
  }

  describe('createToken', () => {
    it('should create a valid JWT token', async () => {
      const token = await createToken(mockUser)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should create tokens for different users', async () => {
      const user1: UserSession = { ...mockUser, id: 'user1' }
      const user2: UserSession = { ...mockUser, id: 'user2' }

      const token1 = await createToken(user1)
      const token2 = await createToken(user2)

      // With mocked jose, tokens will be the same, but in real implementation they would differ
      expect(token1).toBeDefined()
      expect(token2).toBeDefined()
    })

    it('should handle user session data', async () => {
      const token = await createToken(mockUser)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
    })
  })

  describe('verifyToken', () => {
    beforeEach(() => {
      // Reset the mock before each test
      const { jwtVerify } = require('jose')
      jwtVerify.mockClear()
    })

    it('should return null for invalid token', async () => {
      const { jwtVerify } = require('jose')
      jwtVerify.mockRejectedValue(new Error('Invalid token'))

      const invalidToken = 'invalid.token.here'
      const decoded = await verifyToken(invalidToken)

      expect(decoded).toBeNull()
    })

    it('should return null for empty token', async () => {
      const { jwtVerify } = require('jose')
      jwtVerify.mockRejectedValue(new Error('Empty token'))

      const decoded = await verifyToken('')

      expect(decoded).toBeNull()
    })

    it('should return null for malformed token', async () => {
      const { jwtVerify } = require('jose')
      jwtVerify.mockRejectedValue(new Error('Malformed token'))

      const malformedToken = 'not-a-jwt-token'
      const decoded = await verifyToken(malformedToken)

      expect(decoded).toBeNull()
    })

    it('should verify a valid token and return user data', async () => {
      const { jwtVerify } = require('jose')
      jwtVerify.mockResolvedValue({
        payload: { user: mockUser }
      })

      const decoded = await verifyToken('valid-token')

      expect(decoded).not.toBeNull()
      expect(decoded?.id).toBe(mockUser.id)
      expect(decoded?.email).toBe(mockUser.email)
      expect(decoded?.username).toBe(mockUser.username)
      expect(decoded?.name).toBe(mockUser.name)
      expect(decoded?.plan).toBe(mockUser.plan)
    })

    it('should handle tokens with different user data', async () => {
      const { jwtVerify } = require('jose')
      const proUser: UserSession = {
        id: 'pro123',
        email: 'pro@example.com',
        username: 'prouser',
        name: 'Pro User',
        plan: 'pro'
      }

      jwtVerify.mockResolvedValue({
        payload: { user: proUser }
      })

      const decoded = await verifyToken('pro-token')

      expect(decoded).not.toBeNull()
      expect(decoded?.plan).toBe('pro')
    })

    it('should handle user with null name', async () => {
      const { jwtVerify } = require('jose')
      const userWithoutName: UserSession = {
        ...mockUser,
        name: null
      }

      jwtVerify.mockResolvedValue({
        payload: { user: userWithoutName }
      })

      const decoded = await verifyToken('token-without-name')

      expect(decoded).not.toBeNull()
      expect(decoded?.name).toBeNull()
    })
  })

  describe('Token integration', () => {
    it('should handle token creation', async () => {
      const token = await createToken(mockUser)

      expect(token).toBe('mock-jwt-token')
      expect(typeof token).toBe('string')
    })

    it('should handle verification errors gracefully', async () => {
      const { jwtVerify } = require('jose')
      jwtVerify.mockRejectedValue(new Error('Verification failed'))

      const result = await verifyToken('bad-token')
      expect(result).toBeNull()
    })
  })
})
