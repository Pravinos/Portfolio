const RATE_LIMIT_MARKER = "RATE_LIMIT|";

function getErrorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error);
}

export function isRateLimitError(error: unknown): boolean {
  const message = getErrorText(error).toLowerCase();

  return (
    message.startsWith(RATE_LIMIT_MARKER.toLowerCase()) ||
    message.includes("rate limit") ||
    message.includes("rate_limit") ||
    message.includes("429")
  );
}

export function parseRetryAfter(error: unknown): string | null {
  const message = getErrorText(error);
  const match = message.match(/try again in (\d+m[\d.]*s|\d+(?:\.\d+)?s)/i);

  if (!match?.[1]) return null;

  return formatRetryDuration(match[1]);
}

function formatRetryDuration(raw: string): string {
  const minutesMatch = raw.match(/^(\d+)m([\d.]+)s$/i);
  if (minutesMatch) {
    const minutes = Number.parseInt(minutesMatch[1], 10);
    return minutes <= 1 ? "about a minute" : `about ${minutes} minutes`;
  }

  const secondsMatch = raw.match(/^([\d.]+)s$/i);
  if (secondsMatch) {
    const seconds = Math.ceil(Number.parseFloat(secondsMatch[1]));
    if (seconds < 60) {
      return seconds <= 1 ? "about a second" : `about ${seconds} seconds`;
    }

    const minutes = Math.ceil(seconds / 60);
    return minutes <= 1 ? "about a minute" : `about ${minutes} minutes`;
  }

  return raw;
}

export function formatProviderRateLimitError(error: unknown): string {
  const retry = parseRetryAfter(error);
  const wait = retry
    ? ` Try again ${retry}.`
    : " Try again in a few minutes.";

  return `${RATE_LIMIT_MARKER}The assistant hit its daily AI usage limit.${wait}`;
}

export type ChatErrorDisplay = {
  kind: "rate-limit" | "generic";
  title: string;
  message: string;
};

export function resolveChatError(error: Error | undefined): ChatErrorDisplay | null {
  if (!error) return null;

  const jsonRateLimitMessage = parseRateLimitJson(error.message);
  if (jsonRateLimitMessage) {
    return {
      kind: "rate-limit",
      title: "slow down",
      message: jsonRateLimitMessage,
    };
  }

  if (error.message.startsWith(RATE_LIMIT_MARKER)) {
    return {
      kind: "rate-limit",
      title: "usage limit reached",
      message: error.message.slice(RATE_LIMIT_MARKER.length),
    };
  }

  if (isRateLimitError(error)) {
    const retry = parseRetryAfter(error);

    return {
      kind: "rate-limit",
      title: "usage limit reached",
      message: retry
        ? `The assistant hit its AI usage limit. Try again ${retry}.`
        : "The assistant hit its AI usage limit. Try again in a few minutes.",
    };
  }

  if (error.message.toLowerCase().includes("rate limit exceeded")) {
    return {
      kind: "rate-limit",
      title: "slow down",
      message: "Too many messages in a short time. Wait about a minute, then try again.",
    };
  }

  return {
    kind: "generic",
    title: "request failed",
    message: "Something went wrong while reaching the assistant. Please try again.",
  };
}

function parseRateLimitJson(message: string): string | null {
  try {
    const parsed = JSON.parse(message) as { error?: string; message?: string };

    if (parsed.error === "RATE_LIMIT" && parsed.message) {
      return parsed.message;
    }
  } catch {
    return null;
  }

  return null;
}
