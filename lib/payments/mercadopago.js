// ============================================
// MERCADO PAGO - Integración para Plan PRO
// ============================================

/**
 * Verificar si Mercado Pago está configurado
 */
function isMercadoPagoConfigured() {
  return !!(process.env.MERCADOPAGO_ACCESS_TOKEN && 
           process.env.MERCADOPAGO_ACCESS_TOKEN !== '' &&
           !process.env.MERCADOPAGO_ACCESS_TOKEN.includes('your_'))
}

/**
 * Crear preferencia de pago para Plan PRO
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.name - Nombre del usuario
 * @returns {Promise<string>} URL de pago de Mercado Pago
 */
export async function createProPlanPreference(userData) {
  console.log('📦 Iniciando createProPlanPreference...')
  console.log('👤 Usuario:', userData)
  
  // Validar configuración
  if (!isMercadoPagoConfigured()) {
    console.error('❌ Configuración de MP inválida')
    throw new Error('Mercado Pago no está configurado. Por favor, contacta al administrador.')
  }

  console.log('✅ Configuración de MP válida')

  try {
    console.log('📥 Importando SDK de Mercado Pago...')
    // Importación dinámica del SDK solo si está configurado
    const { MercadoPagoConfig, Preference } = await import('mercadopago')
    
    console.log('🔧 Creando cliente de MP...')
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000 }
    })

    console.log('🎫 Creando preferencia...')
    const preference = new Preference(client)

    const preferenceData = {
      items: [
        {
          id: 'cv-pro-plan',
          title: 'Plan PRO - Generador de CV',
          description: 'Acceso completo a plantillas premium, exportación ilimitada sin marca de agua',
          quantity: 1,
          unit_price: 2000, // ARS $2000
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: userData.name,
        email: userData.email
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/mercadopago/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/mercadopago/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/mercadopago/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/mercadopago/webhook`,
      external_reference: `user_${userData.email}_${Date.now()}`,
      statement_descriptor: 'CV PRO',
      metadata: {
        user_email: userData.email,
        plan: 'professional',
        timestamp: new Date().toISOString()
      }
    }

    console.log('🚀 Enviando preferencia a Mercado Pago API...')
    const response = await preference.create({ body: preferenceData })
    
    console.log('✅ Respuesta de MP recibida')
    console.log('Init point:', response.init_point)
    
    return response.init_point // URL de pago

  } catch (error) {
    console.error('❌ Error creando preferencia de Mercado Pago:', error)
    console.error('Error completo:', JSON.stringify(error, null, 2))
    throw new Error(`No se pudo crear la preferencia de pago: ${error.message}`)
  }
}

/**
 * Verificar estado de pago
 * @param {string} paymentId - ID del pago
 * @returns {Promise<Object>} Estado del pago
 */
export async function verifyPaymentStatus(paymentId) {
  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Error verificando pago')
    }

    const payment = await response.json()
    
    return {
      status: payment.status, // approved, pending, rejected
      statusDetail: payment.status_detail,
      email: payment.payer?.email,
      amount: payment.transaction_amount,
      approved: payment.status === 'approved'
    }

  } catch (error) {
    console.error('Error verificando pago:', error)
    throw error
  }
}

export default {
  createProPlanPreference,
  verifyPaymentStatus
}
