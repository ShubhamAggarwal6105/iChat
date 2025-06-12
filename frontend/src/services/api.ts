const API_BASE_URL = "http://localhost:8000/api"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface TelegramUser {
  id: string
  name: string
  username: string
  phone: string
  avatar?: string
}

export interface TelegramGroup {
  id: string
  telegram_id: number
  name: string
  type: "group"
  avatar?: string
  unreadCount: number
  members: number
  lastMessage?: {
    id: string
    chatId: string
    senderId: string
    senderName: string
    content: string
    timestamp: string
  }
}

export interface TelegramMessage {
  id: string
  chatId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isImportant?: boolean
  hasEvent?: boolean
  eventDetails?: {
    title: string
    date: string
    time: string
    description: string
    type: string
  }
  isFakeNews?: boolean
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "An error occurred",
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  async sendVerificationCode(phoneNumber: string): Promise<ApiResponse<any>> {
    return this.makeRequest("/auth/send-code/", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber }),
    })
  }

  async verifyCode(phoneNumber: string, code: string): Promise<ApiResponse<{ user: TelegramUser }>> {
    return this.makeRequest("/auth/verify-code/", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber, code }),
    })
  }

  async checkAuthentication(): Promise<ApiResponse<{ is_authenticated: boolean; user_data?: TelegramUser }>> {
    return this.makeRequest("/auth/check/")
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.makeRequest("/auth/logout/", {
      method: "POST",
    })
  }

  async getGroups(): Promise<ApiResponse<{ groups: TelegramGroup[] }>> {
    return this.makeRequest("/groups/")
  }

  async getMessages(groupId: string, limit = 100): Promise<ApiResponse<{ messages: TelegramMessage[] }>> {
    return this.makeRequest(`/groups/${groupId}/messages/?limit=${limit}`)
  }
}

export const apiService = new ApiService()
