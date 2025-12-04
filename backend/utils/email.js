import nodemailer from "nodemailer"

/**
 * Email Configuration
 * 
 * For production, set these environment variables:
 * - BACKEND_URL: Your publicly accessible backend URL (e.g., https://api.yourdomain.com)
 * - FRONTEND_URL: Your publicly accessible frontend URL (e.g., https://yourdomain.com)
 * 
 * Example:
 * BACKEND_URL=https://api.otakushop.com FRONTEND_URL=https://otakushop.com node server.js
 * 
 * Note: If using localhost, images won't display in emails as email clients
 * can't access localhost URLs. The email will show a styled placeholder instead.
 */

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "letlabs4dev@gmail.com",
    pass: "sawd ydew uqqg tvpc",
  },
})

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error)
  } else {
    console.log("✅ Email server is ready to send messages")
  }
})

/**
 * Create a beautiful HTML email template for new product notifications
 * Matches the red theme of the app
 */
export function createNewProductEmailTemplate(product) {
  // Handle different image URL formats
  let productImage = product.image || "/uploads/placeholder.jpg"
  let usePlaceholder = false
  
  if (!productImage.startsWith("http")) {
    // If it's a relative path, make it absolute
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000"
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"
    // Check if it's a public path or upload path
    if (productImage.startsWith("/uploads")) {
      productImage = `${backendUrl}${productImage}`
    } else if (productImage.startsWith("/")) {
      productImage = `${baseUrl}${productImage}`
    } else {
      productImage = `${backendUrl}/uploads/${productImage}`
    }
  }
  
  // Check if URL is localhost - email clients can't access localhost
  // Use a placeholder in this case
  if (productImage.includes("localhost") || productImage.includes("127.0.0.1")) {
    usePlaceholder = true
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Product Alert - Entre Nous Otakus</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Red Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                🎌 NEW ARRIVAL ALERT
              </h1>
              <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 14px; letter-spacing: 0.5px;">
                Entre Nous Otakus
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 16px; line-height: 1.6;">
                Hey Otaku! 👋
              </p>
              <p style="margin: 0 0 30px 0; color: #4a4a4a; font-size: 15px; line-height: 1.6;">
                We're excited to announce a brand new addition to our collection! Check out this amazing product that just arrived:
              </p>

              <!-- Product Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 2px solid #dc2626; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 0;">
                    <!-- Product Image -->
                    <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%); display: block; overflow: hidden; position: relative;">
                      ${usePlaceholder 
                        ? `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); display: table-cell; vertical-align: middle; text-align: center; color: #ffffff; font-size: 18px; font-weight: 600; padding: 20px;">
                            <div style="font-size: 48px; margin-bottom: 10px;">🎌</div>
                            <div>${product.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                            <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">View on website to see image</div>
                          </div>`
                        : `<img src="${productImage.replace(/"/g, "&quot;")}" alt="${product.name.replace(/"/g, "&quot;")}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`
                      }
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 25px;">
                    <!-- Product Info -->
                    <h2 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 22px; font-weight: 600;">
                      ${product.name}
                    </h2>
                    <p style="margin: 0 0 15px 0; color: #6b6b6b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                      ${product.category}
                    </p>
                    <div style="margin: 20px 0;">
                      <span style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
                        $${product.price.toFixed(2)}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4); transition: all 0.3s ease;">
                      Shop Now →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Footer Message -->
              <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6; text-align: center;">
                Don't miss out on this exclusive drop! 🎁
              </p>
              <p style="margin: 0; color: #6b6b6b; font-size: 12px; line-height: 1.6; text-align: center;">
                Thank you for being part of the Entre Nous Otakus family!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 10px 0; color: #6b6b6b; font-size: 12px;">
                © 2025 Entre Nous Otakus. All rights reserved.
              </p>
              <p style="margin: 0; color: #8b8b8b; font-size: 11px;">
                Made with ❤️ for otakus everywhere
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
}

/**
 * Send email notification to subscribers about a new product
 */
export async function sendNewProductNotification(product, subscriberEmails) {
  if (!subscriberEmails || subscriberEmails.length === 0) {
    console.log("No subscribers to notify")
    return { success: true, sent: 0 }
  }

  const emailHtml = createNewProductEmailTemplate(product)
  let successCount = 0
  let failCount = 0

  // Send emails to all subscribers
  const emailPromises = subscriberEmails.map(async (email) => {
    try {
      await transporter.sendMail({
        from: '"Entre Nous Otakus" <letlabs4dev@gmail.com>',
        to: email,
        subject: `🎌 New Arrival: ${product.name} - Entre Nous Otakus`,
        html: emailHtml,
        text: `New Product Alert!\n\n${product.name}\nCategory: ${product.category}\nPrice: $${product.price.toFixed(2)}\n\nVisit our store to check it out!`,
      })
      successCount++
      console.log(`✅ Email sent successfully to ${email}`)
    } catch (error) {
      failCount++
      console.error(`❌ Failed to send email to ${email}:`, error.message)
    }
  })

  await Promise.allSettled(emailPromises)

  return {
    success: failCount === 0,
    sent: successCount,
    failed: failCount,
  }
}

export default transporter

