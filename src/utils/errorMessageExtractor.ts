export function extractErrorMessage(err: unknown): string {
  try {
    function isObject(value: unknown): value is Record<string, unknown> {
      return typeof value === 'object' && value !== null;
    }

    let data: unknown = err;
    if (isObject(err)) {
      const errRec = err as Record<string, unknown>;
      if ('response' in errRec && isObject(errRec.response)) {
        const resp = errRec.response as Record<string, unknown>;
        data = 'data' in resp ? resp.data ?? resp : resp;
      } else if ('response' in errRec) {
        data = errRec.response ?? err;
      }
    }

    // 1) Direct string error
    if (typeof data === 'string') return data;

    // 2) Axios default error message
    if (
      isObject(err) &&
      typeof (err as Record<string, unknown>).message === 'string' &&
      !(isObject(data) && (data as Record<string, unknown>).message)
    ) {
      return (err as Record<string, unknown>).message as string;
    }

    // 3) message: string
    if (isObject(data) && typeof (data as Record<string, unknown>).message === 'string') {
      return (data as Record<string, unknown>).message as string;
    }

    // 4) message: array/object like [{ field: "error" }]
    if (isObject(data) && Array.isArray((data as Record<string, unknown>).message)) {
      const msgArr = (data as Record<string, unknown>).message as unknown[];
      return msgArr
        .map((item) => {
          if (isObject(item)) {
            return Object.values(item)
              .flatMap((v) =>
                typeof v === 'string'
                  ? [v]
                  : typeof v === 'number' || typeof v === 'boolean'
                  ? [String(v)]
                  : [],
              )
              .join(', ');
          }
          return String(item);
        })
        .filter(Boolean)
        .join('\n');
    }

    // 5) message: object { field: "error" }
    if (isObject(data) && isObject((data as Record<string, unknown>).message)) {
      return Object.values(
        (data as Record<string, unknown>).message as Record<string, unknown>,
      ).join(', ');
    }

    // 6) Scan prioritized keys first, then fallback to all keys
    if (isObject(data)) {
      const dataRec = data as Record<string, unknown>;
      const PRIORITY_KEYS = ['errors', 'error', 'details'];

      const extractMessages = (value: unknown): string[] => {
        if (typeof value === 'string') return [value];
        if (typeof value === 'number' || typeof value === 'boolean') return [String(value)];
        if (value == null) return [];

        if (Array.isArray(value)) {
          return value.flatMap((item) => {
            if (isObject(item)) {
              return Object.values(item).flatMap((v) =>
                typeof v === 'string'
                  ? [v]
                  : typeof v === 'number' || typeof v === 'boolean'
                  ? [String(v)]
                  : [],
              );
            }
            if (typeof item === 'string') return [item];
            if (typeof item === 'number' || typeof item === 'boolean') return [String(item)];
            return [];
          });
        }

        if (isObject(value)) {
          return Object.values(value).flatMap(extractMessages);
        }

        return [];
      };

      // 6a) Check prioritized keys first
      for (const key of PRIORITY_KEYS) {
        if (key in dataRec) {
          const messages = extractMessages(dataRec[key]);
          if (messages.length > 0) {
            return messages.join('\n');
          }
        }
      }

      // 6b) Fallback: scan all keys (no early return)
      const fallbackMessages: string[] = [];

      for (const value of Object.values(dataRec)) {
        fallbackMessages.push(...extractMessages(value));
      }

      if (fallbackMessages.length > 0) {
        return fallbackMessages.join('\n');
      }
    }
  } catch {
    // Parsing error: ignore safely
  }

  return 'Something went wrong!';
}
