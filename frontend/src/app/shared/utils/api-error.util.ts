interface ApiErrorBody {
  message?: string;
}

interface HttpErrorLike {
  error?: ApiErrorBody;
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const message = (error as HttpErrorLike).error?.message;
    if (message) {
      return message;
    }
  }

  return fallback;
}
