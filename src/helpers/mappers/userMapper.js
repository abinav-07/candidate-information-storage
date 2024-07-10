exports.userDataMapper = (userData) => {
  return {
    user_id: userData.id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    roles: userData.roles,
    phone_number: userData.phone_number,
    dob: userData.dob,
    description: userData.description,
    // Get Latest OTP(Verified or not)
    otp_verified: userData?.userOtps?.otp_verified || false,
    profile_image: userData.profile_image,
    referral_source: userData.referral_source,
    is_verified: userData.is_verified,
  }
}

exports.userJWTDataMapper = (userData) => {
  return {
    user_id: userData.id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    roles: userData.roles,
  }
}
