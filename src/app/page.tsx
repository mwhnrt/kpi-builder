'use client';
import { KPIList } from '@/components/KPIList';
import { Suspense } from 'react';

function KPIListFallback() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-1/4 rounded bg-background-alt"></div>
      <div className="h-32 rounded bg-background-alt"></div>
      <div className="h-32 rounded bg-background-alt"></div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">KPI Builder</h1>

      <Suspense fallback={<KPIListFallback />}>
        <KPIList />
      </Suspense>
    </>
  );
}
