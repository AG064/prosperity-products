export const debug = (label: string, value: unknown): void => {
  console.log(`[${label}]`, JSON.stringify(value, null, 2));
};

export const safeJsonParse = <T = unknown>(
  value: string,
  fallback: T
): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};
