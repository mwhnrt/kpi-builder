import { KPI } from '@/types/kpi';
import { generateFormulaPreview } from '@/utils/formulaDisplay';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface KPICardProps {
  kpi: KPI;
  onDelete: (id: string) => void;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, onDelete }) => (
  <div
    key={kpi.id}
    className="flex flex-col justify-between overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md transition-all duration-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
  >
    <div className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <h3 className="group flex items-center text-xl font-semibold text-foreground">
            {kpi.name}
          </h3>
          <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-900">
            <div className="mb-2">
              <span className="text-foreground/70 font-medium">
                Conditioning:
              </span>
              <div className="mt-1 overflow-x-auto rounded bg-slate-100 p-1.5 font-mono text-xs dark:bg-slate-800">
                {kpi.conditioning
                  ? generateFormulaPreview(JSON.parse(kpi.conditioning))
                  : '(empty)'}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-foreground/70 font-medium">
                Aggregation:
              </span>
              <span className="bg-primary/10 ml-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-primary">
                {kpi.aggregationType}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="flex space-x-2">
        <Link
          href={`/kpi/${kpi.id}/edit`}
          className="flex items-center rounded-md bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <PencilIcon className="mr-1.5 h-4 w-4" />
          Edit
        </Link>
        <button
          onClick={() => onDelete(kpi.id)}
          className="flex items-center rounded-md bg-danger/10 px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger/80 hover:text-white"
        >
          <TrashIcon className="mr-1.5 h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  </div>
);
