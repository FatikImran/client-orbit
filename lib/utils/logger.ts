export function logInfo(event: string, payload?: Record<string, unknown>) {
  console.info(`[INFO] ${event}`, payload ?? {});
}

export function logWarn(event: string, payload?: Record<string, unknown>) {
  console.warn(`[WARN] ${event}`, payload ?? {});
}

export function logError(event: string, payload?: Record<string, unknown>) {
  console.error(`[ERROR] ${event}`, payload ?? {});
}
