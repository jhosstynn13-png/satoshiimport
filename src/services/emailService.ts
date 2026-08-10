import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_yddg4sk';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_nai8q5a';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'wvHL6x0e0ai7it2_L';

export const sendVerificationCode = async (email: string, code: string) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.error('EmailJS credentials not configured');
    throw new Error('Email service not configured. Please check environment variables.');
  }

  try {
    const templateParams = {
      to_email: email,
      verification_code: code,
      app_name: 'SATOSHIMPORT Master',
      reply_to: 'IMPORTSATOSHI@HOTMAIL.COM'
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

const ORDER_SERVICE_ID = 'service_vgf1tia';
const ORDER_TEMPLATE_ID = 'template_xl6vsjm';
const ORDER_PUBLIC_KEY = 'wq3o-6nXjspe6t7m4';

export const sendOrderNotification = async (orderData: any) => {
  try {
    const response = await emailjs.send(
      ORDER_SERVICE_ID, 
      ORDER_TEMPLATE_ID, 
      orderData, 
      ORDER_PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error('Failed to send order notification:', error);
  }
};

export const generateCode = () => {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing O, I
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
