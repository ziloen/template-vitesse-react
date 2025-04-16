import axios from 'axios'
import type { ZodTypeAny } from 'zod'

export const request = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  // 30s timeout
  timeout: 30_000,
  adapter: 'fetch',
})

function validate(data: unknown, schema: ZodTypeAny | undefined) {
  if (!schema) return
  const result = schema.safeParse(data)
  if (!result.success) {
    globalThis.console.error(result.error)
  }
}

request.interceptors.request.use((config) => {
  validate(config.data, config.requestZod)
  return config
})

request.interceptors.response.use(
  (value) => {
    validate(value.data, value.config.responseZod)
    return value
  },
  (error: Error) => {
    throw error
  },
)
