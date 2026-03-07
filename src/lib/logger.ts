// src/lib/logger.ts
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
      },
    },
  }),
})

type LogContext = Record<string, unknown>

export function logApiError(
  message: string,
  error: unknown,
  context: LogContext = {}
) {
  logger.error({ err: error, ...context }, message)
}

export function logApiWarn(message: string, context: LogContext = {}) {
  logger.warn(context, message)
}

export default logger
