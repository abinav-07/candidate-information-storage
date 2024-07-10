const nodemailer = require("nodemailer")
const { BadRequestException } = require("../../exceptions/httpsExceptions")
const { sendOTP } = require("../../templates/sendOTP")

const mailSender = async ({ from, to, subject, body }) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.MAIL_FROM || from,
      to: to,
      subject: subject,
      html: body,
    })
    return info
  } catch (error) {
    console.log("Nodemailer Err:", error)
    throw new BadRequestException(null, "Error occured when trying to send mail.")
  }
}

// Define a function to send emails
const sendVerificationEmail = async (to, subject, otp) => {
  try {
    const body = sendOTP(otp)
    const mailResponse = await mailSender({
      to: to,
      subject: subject,
      body: body,
    })
    return mailResponse
  } catch (error) {
    throw new Error(`Failed to send verification email to: ${to}`)
  }
}

module.exports = {
  sendVerificationEmail,
}
