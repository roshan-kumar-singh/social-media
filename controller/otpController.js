const admin = require('../firebase');

// Generate and send an OTP
async function sendOTP(req, res) {
  try {
    const phoneNumber = req.body.phoneNumber; // Assuming the phone number is sent in the request body
    const idToken = req.body.idToken; // Assuming the ID token is sent in the request body

    // Verify the ID token to ensure its validity
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Update the user's phone number
    await admin.auth().updateUser(userId, { phoneNumber: phoneNumber });

    // Send the OTP
    const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
    const otpConfig = {
      phoneNumber: userRecord.phoneNumber,
      recaptchaToken: null,
    };
    const sessionInfo = await admin.auth().createSessionCookie(otpConfig, { expiresIn: 7 * 24 * 60 * 60 * 1000 });

    console.log(`OTP sent to ${userRecord.phoneNumber}`);
    console.log(`Session cookie: ${sessionInfo.sessionCookie}`);
    console.log(`Expiration time: ${sessionInfo.expiresIn}`);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}

module.exports = {
  sendOTP,
};
