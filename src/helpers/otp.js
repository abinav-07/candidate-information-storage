const otpGenerator = require("otp-generator")
const UserOTPQueries = require("../queries/userOTP")
const { sendVerificationEmail } = require("../services/gmail")

// Returns true if new email was sent, else returns false
const verifyOTPAndSendEmail = async (userId, userEmail, transaction = null) => {
  //   Check if user has verified OTP or not
  const verifyOTP = await UserOTPQueries.getLatestOTP(
    {
      user_id: userId,
    },
    transaction
  )

  //   Return false if user has already verified otp
  if (verifyOTP?.otp_verified) {
    return false
  }

  // Generating OTP and sending to the user's email
  const newOtp = otpGenerator.generate(6, {
    // Only digits
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  })

  // Add the generated OTP to db for verification on later stages.
  await UserOTPQueries.createUserOTP(
    {
      user_id: userId,
      otp_token: newOtp,
      // valid for 5 min
      otp_expiry_date: new Date(new Date().getTime() + 5 * 60000),
    },
    transaction
  )

  await sendVerificationEmail(userEmail, "Verification OTP", newOtp)

  return true
}

module.exports = {
  verifyOTPAndSendEmail,
}
