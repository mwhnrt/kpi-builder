'use client';
import { KPIForm } from '@/components/KPIForm';
import { KPI } from '@/types/kpi';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Failed to fetch KPI');
    error.info = await res.json();
    throw error;
  }
  return res.json();
};

export default function EditKPIPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    data: kpi,
    error,
    isLoading,
  } = useSWR<KPI>(id ? `/api/kpi/${id}` : null, fetcher, {
    onSuccess: (data) => {
      // Parse the conditioning string back to an object if it's stored as a string
      if (typeof data.conditioning === 'string') {
        try {
          data.formula = JSON.parse(data.conditioning);
        } catch (e) {
          console.error('Error parsing formula from conditioning', e);
        }
      }
      return data;
    },
    revalidateOnFocus: false, // Prevent unnecessary revalidation
  });

  const handleUpdate = async (
    data: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await fetch(`/api/kpi/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update KPI');
      }

      router.push('/');
    } catch (err) {
      console.error('Error updating KPI:', err);
      alert(
        'Failed to update KPI: ' +
          (err instanceof Error ? err.message : 'Unknown error')
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-foreground/70">Loading KPI data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-danger/20 bg-danger/5 p-6">
          <h2 className="mb-2 text-xl font-medium text-danger">Error</h2>
          <p className="text-foreground/80">
            {error.message || 'Failed to load KPI'}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-primary hover:text-primary-hover"
          >
            &larr; Return to KPI List
          </Link>
        </div>
      </div>
    );
  }

  if (!kpi) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-warning/5 border-warning/20 rounded-md border p-6">
          <h2 className="text-warning mb-2 text-xl font-medium">
            KPI Not Found
          </h2>
          <p className="text-foreground/80">
            The KPI you are trying to edit could not be found.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-primary hover:text-primary-hover"
          >
            &larr; Return to KPI List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/" className="mr-4 text-primary hover:text-primary-hover">
          &larr; Back to KPI List
        </Link>
        <h1 className="text-3xl font-bold">Edit KPI: {kpi.name}</h1>
      </div>

      <div className="border-foreground/10 rounded-lg border bg-background-alt p-6 shadow-subtle">
        <KPIForm initialData={kpi} onSubmit={handleUpdate} />
      </div>
    </div>
  );
}
