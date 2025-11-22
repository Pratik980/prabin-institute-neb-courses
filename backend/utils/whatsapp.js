import axios from 'axios';
import User from '../models/User.model.js';

// Validate and format phone number
const validatePhoneNumber = (phone) => {
  if (!phone) return { valid: false, error: 'Phone number is required' };
  
  // Remove all spaces, plus signs, dashes, and parentheses
  let cleanPhone = phone.toString().replace(/[\s+\-()]/g, '');
  
  // Remove leading zeros (but keep country codes like 977)
  if (cleanPhone.startsWith('0') && !cleanPhone.startsWith('977')) {
    cleanPhone = cleanPhone.substring(1);
  }
  
  // Check if it already has Nepal country code (977)
  if (cleanPhone.startsWith('977')) {
    // Nepal number with country code should be 13 digits: 977 + 10 digits
    if (cleanPhone.length === 13) {
      return { 
        valid: true, 
        formatted: cleanPhone,
        info: 'Nepal number with country code detected'
      };
    } else if (cleanPhone.length > 13) {
      return {
        valid: false,
        error: `Phone number too long. Expected 13 digits for Nepal (977 + 10 digits), got ${cleanPhone.length} digits`
      };
    } else {
      return {
        valid: false,
        error: `Phone number too short. Expected 13 digits for Nepal (977 + 10 digits), got ${cleanPhone.length} digits`
      };
    }
  }
  
  // Check if it already has another country code (11-15 digits)
  if (cleanPhone.length >= 11 && cleanPhone.length <= 15) {
    return { valid: true, formatted: cleanPhone };
  }
  
  // Check if it looks like a Nepal number without country code (10 digits starting with 98 or 97)
  if (cleanPhone.length === 10 && (cleanPhone.startsWith('98') || cleanPhone.startsWith('97'))) {
    return {
      valid: true,
      formatted: `977${cleanPhone}`,
      warning: `Added Nepal country code. Original: ${cleanPhone}, Formatted: 977${cleanPhone}`
    };
  }
  
  // Too short
  if (cleanPhone.length < 10) {
    return {
      valid: false,
      error: `Phone number too short (${cleanPhone.length} digits). Must include country code (e.g., 9779762825200 for Nepal)`
    };
  }
  
  // Too long
  if (cleanPhone.length > 15) {
    return {
      valid: false,
      error: `Phone number too long (${cleanPhone.length} digits). Maximum is 15 digits`
    };
  }
  
  return { valid: true, formatted: cleanPhone };
};

// Send WhatsApp notification to a specific phone number
const sendWhatsAppToPhone = async (phone, message, apiKey) => {
  try {
    if (!apiKey || !phone) {
      console.log('❌ WhatsApp notification skipped: API key or phone not configured');
      console.log('   API Key:', apiKey ? 'Present' : 'Missing');
      console.log('   Phone:', phone ? phone : 'Missing');
      return false;
    }

    // Validate and format phone number
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.valid) {
      console.error('❌ Invalid phone number:', phoneValidation.error);
      return false;
    }
    
    const cleanPhone = phoneValidation.formatted;
    
    if (phoneValidation.warning) {
      console.warn('⚠️', phoneValidation.warning);
    }
    if (phoneValidation.info) {
      console.log('ℹ️', phoneValidation.info);
    }
    console.log('   Original phone:', phone);
    console.log('   Formatted phone:', cleanPhone);
    
    // Using CallMeBot API
    const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
    
    console.log('📤 Sending WhatsApp notification...');
    console.log('   To:', cleanPhone);
    console.log('   API Key:', apiKey);
    console.log('   Phone length:', cleanPhone.length, 'digits');
    console.log('   URL:', url.substring(0, 120) + '...');

    const response = await axios.get(url, { 
      timeout: 15000,
      validateStatus: function (status) {
        // Accept all status codes to check response content
        return status >= 200 && status < 500;
      }
    });
    
    // Check response content - CallMeBot returns HTML/text responses
    const responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    const responseLower = responseText.toLowerCase();
    
    // Check for common error messages in CallMeBot responses
    if (responseLower.includes('error') || 
        responseLower.includes('invalid') || 
        responseLower.includes('failed') ||
        responseLower.includes('not found') ||
        responseLower.includes('unauthorized')) {
      console.error('❌ CallMeBot API returned an error:');
      console.error('   Response:', responseText.substring(0, 200));
      console.error('   Status:', response.status);
      console.error('   Possible issues:');
      console.error('   1. Phone number format incorrect (needs country code, e.g., 9779812345678)');
      console.error('   2. API key invalid or expired');
      console.error('   3. Phone number not registered with CallMeBot');
      console.error('   Solution: Visit https://www.callmebot.com/blog/free-api-whatsapp-messages/ to get a new API key');
      return false;
    }
    
    // Log full response for debugging (first 500 chars)
    console.log('📋 CallMeBot Response:');
    console.log('   Status:', response.status);
    console.log('   Response preview:', responseText.substring(0, 300));
    
    // Check for success indicators
    if (responseLower.includes('queued') || 
        responseLower.includes('sent') || 
        responseLower.includes('success') ||
        response.status === 200 || 
        response.status === 203) {
      console.log('✅ WhatsApp notification sent successfully to', cleanPhone);
      console.log('   Response status:', response.status);
      console.log('');
      console.log('⚠️  IMPORTANT: If you don\'t receive the message, check:');
      console.log('   1. Phone number format: Should be', cleanPhone, '(with country code)');
      console.log('   2. API key: Must be valid and obtained from CallMeBot');
      console.log('   3. Phone registration: Your phone number MUST be registered with CallMeBot');
      console.log('      → Visit: https://www.callmebot.com/blog/free-api-whatsapp-messages/');
      console.log('      → Enter your phone number and get API key via WhatsApp');
      console.log('   4. WhatsApp: Make sure WhatsApp is open on your phone');
      console.log('   5. Test manually: Try the URL in browser to test');
      return true;
    }
    
    // Unknown response
    console.warn('⚠️  Unknown response from CallMeBot:');
    console.warn('   Status:', response.status);
    console.warn('   Response:', responseText.substring(0, 200));
    return false;
    
  } catch (error) {
    console.error('❌ Error sending WhatsApp notification:');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
    if (error.code === 'ECONNABORTED') {
      console.error('   Request timed out. CallMeBot might be slow or unavailable.');
    }
    return false;
  }
};

// Get admin phone number from database or env
const getAdminPhone = async () => {
  try {
    // Try to get admin phone from database
    const admin = await User.findOne({ role: 'admin' }).select('phone');
    if (admin && admin.phone) {
      return admin.phone;
    }
  } catch (error) {
    console.error('Error fetching admin phone:', error.message);
  }
  
  // Fallback to environment variable
  return process.env.WHATSAPP_PHONE || process.env.ADMIN_PHONE;
};

// Notification when payment is received (to admin)
export const sendWhatsAppNotification = async ({ studentName, courseName, amount, transactionId, studentPhone }) => {
  try {
    console.log('🔔 Payment notification triggered');
    console.log('   Student:', studentName);
    console.log('   Course:', courseName);
    console.log('   Amount:', amount);
    
    const apiKey = process.env.WHATSAPP_API_KEY;
    const adminPhone = await getAdminPhone();

    console.log('   API Key from env:', apiKey ? 'Present' : 'Missing');
    console.log('   Admin Phone:', adminPhone || 'Not found');

    if (!apiKey || !adminPhone) {
      console.log('❌ WhatsApp notification skipped: API key or admin phone not configured');
      console.log('   Please check your .env file:');
      console.log('   - WHATSAPP_API_KEY should be set');
      console.log('   - WHATSAPP_PHONE or ADMIN_PHONE should be set');
      console.log('   - Or add phone number to admin user profile in database');
      return;
    }

    const message = `🎓 New Course Purchase on Prabin Institute!

👤 Student: ${studentName}
📚 Course: ${courseName}
💰 Amount: Rs. ${amount}
🔢 Transaction ID: ${transactionId}

⏳ Status: Pending Approval
✅ Action Needed: Please approve this enrollment in admin dashboard`;

    const success = await sendWhatsAppToPhone(adminPhone, message, apiKey);
    
    if (success) {
      console.log('✅ Payment notification sent successfully to admin');
    } else {
      console.log('❌ Failed to send payment notification');
    }
  } catch (error) {
    console.error('❌ Error in sendWhatsAppNotification:', error.message);
    console.error('   Stack:', error.stack);
  }
};

// Notification when enrollment is approved (to student)
export const sendApprovalNotification = async ({ studentName, studentPhone, courseName }) => {
  try {
    const apiKey = process.env.WHATSAPP_API_KEY;

    if (!apiKey || !studentPhone) {
      console.log('WhatsApp approval notification skipped: API key or student phone not configured');
      return;
    }

    const message = `✅ Enrollment Approved!

Hello ${studentName},

Your enrollment for "${courseName}" has been approved!

🎉 You can now access all video lessons in your dashboard.

Login to start learning: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-courses

Happy Learning! 📚`;

    await sendWhatsAppToPhone(studentPhone, message, apiKey);
  } catch (error) {
    console.error('Error sending approval notification:', error.message);
  }
};

// Notification when enrollment is rejected (to student)
export const sendRejectionNotification = async ({ studentName, studentPhone, courseName }) => {
  try {
    const apiKey = process.env.WHATSAPP_API_KEY;

    if (!apiKey || !studentPhone) {
      console.log('WhatsApp rejection notification skipped: API key or student phone not configured');
      return;
    }

    const message = `❌ Enrollment Update

Hello ${studentName},

Your enrollment for "${courseName}" could not be approved at this time.

Please contact support if you have any questions.

Thank you for your interest in Prabin Institute.`;

    await sendWhatsAppToPhone(studentPhone, message, apiKey);
  } catch (error) {
    console.error('Error sending rejection notification:', error.message);
  }
};

// Notification to admin when they approve/reject (for logging)
export const sendAdminActionNotification = async ({ action, studentName, courseName, adminPhone }) => {
  try {
    const apiKey = process.env.WHATSAPP_API_KEY;
    const phone = adminPhone || await getAdminPhone();

    if (!apiKey || !phone) {
      return;
    }

    const actionEmoji = action === 'approved' ? '✅' : '❌';
    const message = `${actionEmoji} Enrollment ${action.charAt(0).toUpperCase() + action.slice(1)}

👤 Student: ${studentName}
📚 Course: ${courseName}
⏰ Time: ${new Date().toLocaleString()}

Action completed successfully.`;

    await sendWhatsAppToPhone(phone, message, apiKey);
  } catch (error) {
    console.error('Error sending admin action notification:', error.message);
  }
};

