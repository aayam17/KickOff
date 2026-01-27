const express = require('express');
const router = express.Router();
const { sendOTP } = require('../utils/email');
const { generateOTP } = require('../utils/otp');

// Test email endpoint (for development only)
router.get('/test-email', async (req, res) => {
  try {
    const testEmail = req.query.email || process.env.EMAIL_USER;
    const { otp } = generateOTP();
    
    console.log(`🧪 Testing email to: ${testEmail}`);
    
    const success = await sendOTP(testEmail, otp);
    
    if (success) {
      res.json({ 
        success: true, 
        message: `Test email sent to ${testEmail}. Check your inbox!`,
        otp: otp // Only for testing - remove in production
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send test email. Check backend console for details.' 
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending test email',
      error: error.message 
    });
  }
});

module.exports = router;
