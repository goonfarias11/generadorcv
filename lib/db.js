import { kv } from '@vercel/kv'

/**
 * Sistema de base de datos con Vercel KV
 * Almacena información de usuarios y sus suscripciones PRO
 */

// Generar ID único para usuarios
export function generateUserId() {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Guardar usuario con comprobante
 */
export async function saveUserReceipt(userId, data) {
  const user = {
    id: userId,
    email: data.email || '',
    name: data.name || '',
    phone: data.phone || '',
    receiptUrl: data.receiptUrl,
    subscriptionStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  await kv.set(`user:${userId}`, user)
  
  // Agregar a lista de pendientes
  await kv.sadd('users:pending', userId)
  
  return user
}

/**
 * Obtener usuario por ID
 */
export async function getUserById(userId) {
  return await kv.get(`user:${userId}`)
}

/**
 * Obtener usuario por email
 */
export async function getUserByEmail(email) {
  const allUserIds = await kv.smembers('users:all')
  
  for (const userId of allUserIds) {
    const user = await kv.get(`user:${userId}`)
    if (user && user.email === email) {
      return user
    }
  }
  
  return null
}

/**
 * Actualizar estado de suscripción
 */
export async function updateUserSubscription(userId, status) {
  const user = await getUserById(userId)
  
  if (!user) {
    throw new Error('Usuario no encontrado')
  }
  
  user.subscriptionStatus = status
  user.updatedAt = new Date().toISOString()
  
  if (status === 'active') {
    user.activatedAt = new Date().toISOString()
  }
  
  await kv.set(`user:${userId}`, user)
  
  // Actualizar listas
  if (status === 'active') {
    await kv.srem('users:pending', userId)
    await kv.sadd('users:active', userId)
  } else if (status === 'rejected') {
    await kv.srem('users:pending', userId)
    await kv.sadd('users:rejected', userId)
  }
  
  return user
}

/**
 * Obtener todos los usuarios pendientes
 */
export async function getPendingUsers() {
  const pendingIds = await kv.smembers('users:pending')
  const users = []
  
  for (const userId of pendingIds) {
    const user = await kv.get(`user:${userId}`)
    if (user) {
      users.push(user)
    }
  }
  
  return users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * Obtener todos los usuarios activos
 */
export async function getActiveUsers() {
  const activeIds = await kv.smembers('users:active')
  const users = []
  
  for (const userId of activeIds) {
    const user = await kv.get(`user:${userId}`)
    if (user) {
      users.push(user)
    }
  }
  
  return users.sort((a, b) => new Date(b.activatedAt) - new Date(a.activatedAt))
}

/**
 * Guardar URL de comprobante en Vercel Blob
 */
export async function saveReceiptUrl(userId, url) {
  const user = await getUserById(userId)
  
  if (!user) {
    throw new Error('Usuario no encontrado')
  }
  
  user.receiptUrl = url
  user.updatedAt = new Date().toISOString()
  
  await kv.set(`user:${userId}`, user)
  await kv.sadd('users:all', userId)
  
  return user
}
