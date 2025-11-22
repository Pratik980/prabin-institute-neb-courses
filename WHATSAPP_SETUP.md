# WhatsApp Notifications Setup Guide

This guide will help you set up WhatsApp notifications using CallMeBot API for Prabin Institute.

## What is CallMeBot?

CallMeBot is a **FREE** service that allows you to send WhatsApp messages via API. It's perfect for automated notifications.

## Step-by-Step Setup

### Step 1: Visit CallMeBot Website

Go to: **https://www.callmebot.com/blog/free-api-whatsapp-messages/**

Or directly: **https://www.callmebot.com/**

### Step 2: Get Your API Key

1. **Scroll down** on the CallMeBot page until you see the section about "Free WhatsApp API"
2. Look for the **"Get Your API Key"** button or link
3. You'll be asked to:
   - Enter your **WhatsApp phone number** (with country code, e.g., +9779812345678 for Nepal)
   - Enter your **name** (optional)
   - Click **"Get API Key"**

### Step 3: Receive API Key via WhatsApp

1. CallMeBot will send you a **WhatsApp message** with your API key
2. The message will look like: `Your API key is: 12345678`
3. **Copy this API key** - you'll need it for your `.env` file

### Step 4: Format Your Phone Number

Your phone number must be in **international format** (with country code, no spaces or dashes):

**Examples:**
- Nepal: `+9779812345678` (remove the + sign for .env: `9779812345678`)
- India: `+919876543210` (remove the + sign for .env: `919876543210`)
- USA: `+1234567890` (remove the + sign for .env: `1234567890`)

**Important:** 
- Remove the `+` sign when adding to `.env` file
- No spaces, no dashes, no parentheses
- Include country code (e.g., 977 for Nepal, 91 for India)

### Step 5: Add to Your .env File

Open your `backend/.env` file and add:

```env
# WhatsApp Notification Settings
WHATSAPP_API_KEY=your_api_key_from_callmebot
WHATSAPP_PHONE=your_phone_number_with_country_code_no_plus_sign
ADMIN_PHONE=your_phone_number_with_country_code_no_plus_sign
```

**Example for Nepal:**
```env
WHATSAPP_API_KEY=12345678
WHATSAPP_PHONE=9779812345678
ADMIN_PHONE=9779812345678
```

**Example for India:**
```env
WHATSAPP_API_KEY=87654321
WHATSAPP_PHONE=919876543210
ADMIN_PHONE=919876543210
```

### Step 6: Alternative - Use Admin Phone from Database

Instead of using environment variables, you can also:

1. **Add phone number to your admin user account:**
   - Login to your admin account
   - Go to Profile page
   - Add your phone number
   - Save

2. The system will **automatically use the admin's phone number** from the database
3. Environment variables (`WHATSAPP_PHONE` or `ADMIN_PHONE`) will be used as fallback

### Step 7: Test the Setup

1. **Restart your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test by making a payment:**
   - Register as a student
   - Purchase a course
   - You should receive a WhatsApp notification on your admin phone

## How It Works

### When Student Makes Payment:
- Admin receives WhatsApp notification with:
  - Student name
  - Course name
  - Amount paid
  - Transaction ID
  - Action needed (approve enrollment)

### When Admin Approves Enrollment:
- Student receives WhatsApp notification (if student has phone number)
- Admin receives confirmation notification

### When Admin Rejects Enrollment:
- Student receives WhatsApp notification (if student has phone number)
- Admin receives confirmation notification

## Troubleshooting

### Problem: Not receiving WhatsApp messages

**Solutions:**
1. **Check API Key:**
   - Make sure you copied the API key correctly
   - No extra spaces or characters

2. **Check Phone Number Format:**
   - Must be in international format
   - No `+` sign in `.env` file
   - No spaces or dashes
   - Example: `9779812345678` (not `+977 981-234-5678`)

3. **Verify CallMeBot Setup:**
   - Make sure you received the API key via WhatsApp
   - Try getting a new API key if the old one doesn't work

4. **Check Server Logs:**
   - Look for error messages in your backend console
   - Check if it says "WhatsApp notification skipped"

5. **Test API Key:**
   - Visit: `https://api.callmebot.com/whatsapp.php?phone=YOUR_PHONE&text=Test&apikey=YOUR_API_KEY`
   - Replace `YOUR_PHONE` and `YOUR_API_KEY` with your values
   - You should receive a test message

### Problem: API Key expired

**Solution:**
- Get a new API key from CallMeBot
- Update your `.env` file
- Restart your server

## Important Notes

1. **CallMeBot is FREE** but has rate limits
2. **Don't share your API key** publicly
3. **Keep your `.env` file secure** - never commit it to Git
4. **Phone numbers must be verified** with CallMeBot first
5. **Country code is required** - don't forget it!

## Alternative Services

If CallMeBot doesn't work for you, you can also use:

1. **Twilio WhatsApp API** (Paid, more reliable)
2. **WhatsApp Business API** (Official, requires approval)
3. **Green API** (Paid alternative)

## Support

If you're still having issues:
1. Check CallMeBot documentation: https://www.callmebot.com/blog/free-api-whatsapp-messages/
2. Verify your phone number format
3. Check backend server logs for error messages
4. Make sure your `.env` file is in the `backend` directory

---

**Quick Reference:**

```env
# In backend/.env file
WHATSAPP_API_KEY=12345678                    # From CallMeBot WhatsApp message
WHATSAPP_PHONE=9779812345678                 # Your phone (no +, no spaces)
ADMIN_PHONE=9779812345678                    # Same as above (fallback)
```

**Phone Number Format:**
- ✅ Correct: `9779812345678`
- ❌ Wrong: `+9779812345678` (has + sign)
- ❌ Wrong: `977 981 234 5678` (has spaces)
- ❌ Wrong: `9812345678` (missing country code)

