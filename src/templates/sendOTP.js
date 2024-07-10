// Email Templates
const sendOTP = (otpNumber) => {
  return `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otpNumber}</p>`
}

module.exports = { sendOTP }
