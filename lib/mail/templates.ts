interface TemplateData {
  orderNumber?: string
  customerName?: string
  items?: any[]
  total?: string
  status?: string
  trackingNumber?: string
  courierName?: string
  message?: string
  subject?: string
  ctaUrl?: string
  ctaText?: string
}

const baseLayout = (title: string, headline: string, contentHtml: string, cta?: { url: string; text: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; background-color:#f5f5f4; font-family: 'Montserrat', Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f4">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border:1px solid #e2e2e2; margin:40px auto;">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#111111; padding:40px 30px; border-bottom:1px solid #e2e2e2; ">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://dimensionfashions.com'}" 
                 style="font-size:24px; font-weight:500; letter-spacing:3px; color:#ffffff;  text-decoration:none; text-transform:uppercase; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;">
                Dimensions
              </a>
            </td>
          </tr>
          <!-- Hero -->
          <tr>
            <td align="center" style=" padding:20px 30px; color:#ffffff;">
              <h1 style="margin:0 0 15px 0; font-size:32px; font-weight:400; color:#000000; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;">
                ${headline}
              </h1>
              <p style="margin:0; font-size:14px; letter-spacing:2px; color:#555555; text-transform:uppercase; font-family: 'Montserrat', Arial, Helvetica, sans-serif;">
                Elevate Your Wardrobe
              </p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td align="center" style="padding:0px 40px; font-family: 'Montserrat', Arial, Helvetica, sans-serif;">
              <div style="font-size:15px; color:#555555; margin-bottom:25px; text-align: left;">
                ${contentHtml}
              </div>
              ${cta ? `
              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
                <tr>
                  <td align="center" bgcolor="#FE624B">
                    <a href="${cta.url}" 
                       style="display:inline-block; padding:16px 32px; font-size:12px; font-weight:600; 
                              color:#ffffff; text-decoration:none; text-transform:uppercase; letter-spacing:1px; font-family: 'Montserrat', Arial, Helvetica, sans-serif;">
                      ${cta.text}
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}
              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid #e2e2e2; padding-top:10px;"></td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f9f9f9; padding:30px; border-top:1px solid #e2e2e2; font-family: 'Montserrat', Arial, Helvetica, sans-serif;">
              <p style="font-size:12px; color:#888888; margin:0;">
                &copy; ${new Date().getFullYear()} Dimensions. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export const orderConfirmationTemplate = (data: TemplateData) => {
  const content = `
    <p>Hi ${data.customerName || 'Customer'},</p>
    <p>Thank you for your order! We're thrilled that you chose Dimensions to elevate your wardrobe. Your order <strong>#${data.orderNumber}</strong> has been confirmed and is being processed.</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <tr>
        <td colspan="2"><h3 style="font-family: 'Playfair Display', serif; margin-top: 0;">Order Summary</h3></td>
      </tr>
      ${data.items?.map(item => `
        <tr>
          <td style="font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eee;">
            ${item.title} (x${item.quantity})
          </td>
          <td align="right" style="font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">
            ₹${(item.price_at_purchase || item.price).toLocaleString()}
          </td>
        </tr>
      `).join('')}
      <tr>
        <td style="font-weight: 600; font-size: 16px; padding-top: 15px;">Total Amount</td>
        <td align="right" style="font-weight: 600; font-size: 16px; padding-top: 15px; color: #FE624B;">
          ₹${data.total}
        </td>
      </tr>
    </table>
  `
  return baseLayout(
    'Order Confirmed',
    'Order Confirmed.',
    content,
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/orders`, text: 'View My Orders' }
  )
}

export const orderStatusUpdateTemplate = (data: TemplateData) => {
  const content = `
    <p>Hi ${data.customerName || 'Customer'},</p>
    <p>We're writing to let you know that your order <strong>#${data.orderNumber}</strong> has been updated.</p>
    <p style="font-size: 18px; color: #111;">Current Status: <span style="font-weight: 600; text-transform: uppercase; color: #FE624B;">${data.status}</span></p>
    
    ${data.trackingNumber ? `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 25px 0;">
        <tr>
          <td><h3 style="font-family: 'Playfair Display', serif; margin-top: 0;">Shipping Details</h3></td>
        </tr>
        <tr>
          <td style="font-size: 14px; padding-bottom: 5px;">Courier: <strong>${data.courierName}</strong></td>
        </tr>
        <tr>
          <td style="font-size: 14px;">Tracking Number: <strong>${data.trackingNumber}</strong></td>
        </tr>
      </table>
    ` : ''}
  `
  return baseLayout(
    'Order Update',
    'Order Updated.',
    content,
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/orders`, text: 'Track Order' }
  )
}

export const contactAcknowledgmentTemplate = (data: TemplateData) => {
  const content = `
    <p>Hi ${data.customerName},</p>
    <p>Thank you for reaching out to us. We've received your message regarding <strong>"${data.subject}"</strong> and our team will get back to you shortly.</p>
    <div style="border-left: 3px solid #FE624B; padding-left: 15px; font-style: italic; color: #777; margin: 20px 0;">
      "${data.message}"
    </div>
  `
  return baseLayout(
    'Message Received',
    'We Hear You.',
    content
  )
}

export const adminOrderAlertTemplate = (data: TemplateData) => {
  const content = `
    <p>A new order has been placed on Dimensions.</p>
    <p>Order Number: <strong>#${data.orderNumber}</strong></p>
    <p>Customer: <strong>${data.customerName}</strong></p>
    <p>Amount: <strong>₹${data.total}</strong></p>
  `
  return baseLayout(
    'New Order Alert',
    'New Order.',
    content,
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders`, text: 'Manage Order' }
  )
}

export const adminCancellationAlertTemplate = (data: TemplateData) => {
  const content = `
    <p>A customer has requested to cancel an order.</p>
    <p>Order Number: <strong>#${data.orderNumber}</strong></p>
    <p>Customer: <strong>${data.customerName}</strong></p>
    <p>Order Amount: <strong>₹${data.total}</strong></p>
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff3f3; padding: 20px; border-radius: 4px; margin: 25px 0; border-left: 4px solid #e74c3c;">
      <tr>
        <td>
          <h3 style="font-family: 'Playfair Display', serif; margin-top: 0; color: #e74c3c;">Reason for Cancellation</h3>
          <p style="font-size: 14px; color: #555; font-style: italic;">"${data.message}"</p>
        </td>
      </tr>
    </table>
    <p style="font-size: 13px; color: #888;">Please review this request and take appropriate action from the admin dashboard.</p>
  `
  return baseLayout(
    'Order Cancellation Request',
    'Cancellation Request.',
    content,
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders`, text: 'Review Order' }
  )
}

