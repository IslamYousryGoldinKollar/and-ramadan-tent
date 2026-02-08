import QRCode from 'qrcode'

/**
 * Generate QR code as data URL for a reservation serial number
 */
export async function generateQRCode(serialNumber: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(serialNumber, {
      errorCorrectionLevel: 'L',
      width: 150,
      margin: 1,
    })
    return qrCodeDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code as buffer (for email attachments)
 */
export async function generateQRCodeBuffer(serialNumber: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(serialNumber, {
      errorCorrectionLevel: 'M',
      width: 300,
      margin: 1,
    })
    return buffer
  } catch (error) {
    console.error('Error generating QR code buffer:', error)
    throw new Error('Failed to generate QR code buffer')
  }
}
