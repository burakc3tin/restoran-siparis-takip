import QRCode from 'qrcode';

/**
 * Generates a QR code image as a base64 Data URL.
 * 
 * @param {string} text - The text or URL to encode in the QR code.
 * @returns {Promise<string>} - A promise that resolves to the base64 Data URL.
 */
export const generateQRCode = async (text) => {
  try {
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',   // Black
        light: '#ffffff'   // White background
      }
    };
    
    const qrDataUrl = await QRCode.toDataURL(text, opts);
    return qrDataUrl;
  } catch (err) {
    console.error('QR Kodu oluşturulurken hata:', err);
    return null;
  }
};
