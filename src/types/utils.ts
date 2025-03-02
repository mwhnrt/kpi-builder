// Define a custom error type that includes the info property
export interface FetchError extends Error {
  info?: Record<string, unknown>;
}