import { KPI } from '@/types/kpi';
import {
  PresentationChartLineIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline/index.js';
import Link from 'next/link';
import useSWR, { useSWRConfig } from 'swr';
import { KPICard } from './KPICard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function KPIList() {
  const { mutate } = useSWRConfig();
  const { data: kpis, error, isLoading } = useSWR<KPI[]>('/api/kpi', fetcher);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this KPI?')) return;

    try {
      const response = await fetch(`/api/kpi/${id}`, { method: 'DELETE' });
      if (response.ok) {
        // Optimistic UI update - filter out the deleted item instantly
        mutate(
          '/api/kpi',
          kpis?.filter((kpi) => kpi.id !== id),
          false
        );
        // Then revalidate to ensure data consistency
        mutate('/api/kpi');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete KPI');
      }
    } catch (error) {
      console.error('Error deleting KPI:', error);
      alert('Failed to delete KPI. Please try again.');
    }
  };

  if (isLoading)
    return (
      <div className="flex animate-pulse flex-col items-center justify-center py-12">
        <ArrowPathIcon className="text-primary/60 h-12 w-12 animate-spin" />
        <p className="text-foreground/70 mt-4 text-lg font-medium">
          Loading KPIs...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="rounded-lg border border-danger/20 bg-danger/10 p-6 text-center text-danger">
        <p className="text-lg font-medium">Error loading KPIs</p>
        <p className="mt-2 text-sm">Please try refreshing the page</p>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold text-foreground">
          <PresentationChartLineIcon className="mr-2 h-6 w-6 text-primary" />
          KPIs
        </h2>
        <Link
          href="/kpi/create"
          className="hover:bg-primary/80 rounded-md bg-primary px-4 py-2 text-white shadow-md transition-all duration-200 hover:scale-105"
        >
          Create New KPI
        </Link>
      </div>

      {kpis && kpis.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <PresentationChartLineIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No KPIs found
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Create your first KPI to get started.
          </p>
          <Link
            href="/kpi/create"
            className="hover:bg-primary/80 mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-white shadow-md transition-all duration-200"
          >
            Create New KPI
          </Link>
        </div>
      )}
    </div>
  );
}
