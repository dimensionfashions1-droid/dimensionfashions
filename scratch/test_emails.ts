import { sendEmail } from '../lib/mail/mailer'
import { 
  orderConfirmationTemplate, 
  orderStatusUpdateTemplate, 
  contactAcknowledgmentTemplate, 
  adminOrderAlertTemplate 
} from '../lib/mail/templates'
import dotenv from 'dotenv'
import path from 'path'

// Load env variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testEmails() {
  const testEmail = process.env.SMTP_USER // Sending to yourself by default
  
  if (!testEmail) {
    console.error('Error: SMTP_USER not found in .env.local')
    return
  }

  console.log(`Starting email tests to: ${testEmail}...`)

  const mockData = {
    orderNumber: 'TEST-123456',
    customerName: 'Test User',
    items: [
      { title: 'Midnight Kanjivaram Saree', quantity: 1, price: 4999 },
      { title: 'Golden Juttis', quantity: 2, price: 1299 }
    ],
    total: '7,597',
    status: 'Shipped',
    trackingNumber: 'DEL123456789',
    courierName: 'Delhivery',
    message: 'I would like to know about the fabric quality of the new collection.',
    subject: 'Product Inquiry'
  }

  try {
    // 1. Test Order Confirmation
    console.log('Sending Order Confirmation test...')
    await sendEmail({
      to: testEmail,
      subject: 'Test: Order Confirmed',
      html: orderConfirmationTemplate(mockData)
    })

    // 2. Test Status Update
    console.log('Sending Status Update test...')
    await sendEmail({
      to: testEmail,
      subject: 'Test: Order Status Update',
      html: orderStatusUpdateTemplate(mockData)
    })

    // 3. Test Contact Acknowledgment
    console.log('Sending Contact Acknowledgment test...')
    await sendEmail({
      to: testEmail,
      subject: 'Test: Message Received',
      html: contactAcknowledgmentTemplate(mockData)
    })

    // 4. Test Admin Alert
    console.log('Sending Admin Order Alert test...')
    await sendEmail({
      to: testEmail,
      subject: 'Test Admin: New Order Alert',
      html: adminOrderAlertTemplate(mockData)
    })

    console.log('All test emails sent successfully! Check your inbox.')
  } catch (error) {
    console.error('Email test failed:', error)
  }
}

testEmails()
