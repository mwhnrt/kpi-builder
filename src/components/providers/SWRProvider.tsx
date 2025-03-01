'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

// Global fetcher implementation for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the request failed, throw an error
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    const info = await res.json().catch(() => ({}));
    error.info = info;
    throw error;
  }

  return res.json();
};

interface SWRProviderProps {
  children: ReactNode;
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false, // Disable auto revalidation on focus
        revalidateOnReconnect: true, // Revalidate when browser regains connection
        errorRetryCount: 3, // Retry failed requests 3 times
        shouldRetryOnError: true, // Enable retry on error
      }}
    >
      {children}
    </SWRConfig>
  );
}
