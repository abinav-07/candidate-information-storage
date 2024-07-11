import axios from "axios"

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}`,
  responseType: "json",
})

API.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("candidate-portal-token")

    if (token) {
      config.headers["Authorization"] = "Bearer " + token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { API }
