"use client"

import { Buffer } from "buffer"

export const parseJwt = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("candidate-portal-token") : false
  if (!token) {
    return null
  }
  const base64Url = token.split(".")[1]
  const base64 = base64Url.replace("-", "+").replace("_", "/")

  return JSON.parse(Buffer.from(base64, "base64").toString())
}

export const removeToken = (itemName: string) => {
  localStorage.removeItem(itemName)
  sessionStorage.removeItem(itemName)
}
