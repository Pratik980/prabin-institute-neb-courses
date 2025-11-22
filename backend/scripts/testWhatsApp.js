import dotenv from 'dotenv';
import { sendWhatsAppNotification } from '../utils/whatsapp.js';

// Load environment variables
dotenv.config({ path: './.env' });

console.log('🧪 Testing WhatsApp Notification...\n');

// Check environment variables
console.log('📋 Environment Check:');
console.log('   WHATSAPP_API_KEY:', process.env.WHATSAPP_API_KEY ? '✅ Present' : '❌ Missing');
console.log('   WHATSAPP_PHONE:', process.env.WHATSAPP_PHONE ? `✅ Present (${process.env.WHATSAPP_PHONE})` : '❌ Missing');
console.log('   ADMIN_PHONE:', process.env.ADMIN_PHONE ? `✅ Present (${process.env.ADMIN_PHONE})` : '❌ Missing');
console.log('');

// Test notification
console.log('📤 Sending test notification...\n');

sendWhatsAppNotification({
  studentName: 'Test Student',
  courseName: 'Test Course',
  amount: 1000,
  transactionId: 'TEST-12345',
  studentPhone: '9779812345678'
}).then(() => {
  console.log('\n✅ Test completed! Check your WhatsApp.');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
});

