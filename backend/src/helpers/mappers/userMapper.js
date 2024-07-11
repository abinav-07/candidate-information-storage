exports.userDataMapper = (userData) => {
  return {
    id: userData?.id,
    first_name: userData?.first_name,
    last_name: userData?.last_name,
    email: userData?.email,
    roles: userData?.roles,
    created_at: userData?.created_at,
  }
}

exports.userJWTDataMapper = (userData) => {
  return {
    id: userData?.id,
    first_name: userData?.first_name,
    last_name: userData?.last_name,
    email: userData?.email,
    roles: userData?.roles,
  }
}
