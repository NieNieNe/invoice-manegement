const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const ACCESS_TOKEN_KEY = 'accessToken'

type LoginPayload = {
  email: string
  password: string
}

type LoginUser = {
  id: number
  fullName: string
  email: string
}

type LoginResponse = {
  message: string
  user: LoginUser
  accessToken: string
}

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let errorMessage = `Login failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep fallback message
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as LoginResponse
}
