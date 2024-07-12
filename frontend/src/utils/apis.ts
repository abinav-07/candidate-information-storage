import { API_URL } from "@/constants"
import axios from "axios"
import Router from "next/router"
import { removeToken } from "./token"

const API = axios.create({
  baseURL: `${API_URL}`,
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

API.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    if (error.response.status === 401) {
      removeToken("candidate-portal-token")
      Router.push("/login")
    }
    throw error
  }
)

export { API }
