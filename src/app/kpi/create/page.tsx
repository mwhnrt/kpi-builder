'use client';

import { KPIForm } from '@/components/KPIForm';
import { KPI } from '@/types/kpi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { mutate } from 'swr';

export default function CreateKPIPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (
    data: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/kpi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create KPI');
      }

      // Invalidate the KPI list cache so it will refetch with the new data
      mutate('/api/kpi');
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create KPI');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/" className="mr-4 text-primary hover:text-primary-hover">
          &larr; Back to KPI List
        </Link>
        <h1 className="text-3xl font-bold">Create New KPI</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-danger/20 bg-danger/5 p-4 text-danger">
          {error}
        </div>
      )}

      <div className="border-foreground/10 rounded-lg border bg-background-alt p-6 shadow-subtle">
        <KPIForm onSubmit={handleCreate} />
      </div>

      {isSubmitting && (
        <div className="bg-background/50 fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex items-center space-x-4 rounded-lg bg-background-alt p-6 shadow-lg">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p>Creating KPI...</p>
          </div>
        </div>
      )}
    </div>
  );
}
