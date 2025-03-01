import { FC } from 'react';
import {
  OperatorItem,
  VariableItem,
  ConstantItem,
  OperatorType,
} from '@/types/formula';
import { DropTarget } from '../DragComponents';
import { DragItem } from '@/utils/dragAndDrop';
import { FormulaItem } from './FormulaItem';

const labelColorsByType = {
  add: 'bg-[var(--operator-add)]',
  subtract: 'bg-[var(--operator-subtract)]',
  multiply: 'bg-[var(--operator-multiply)]',
  divide: 'bg-[var(--operator-divide)]',
} as const;

export const OperatorLabel: FC<{ type: OperatorType }> = ({ type }) => {
  return (
    <div
      className={`flex w-6 items-center justify-center ${labelColorsByType[type]} rounded-l-md`}
    >
      <span className="-rotate-90 whitespace-nowrap text-xs uppercase capitalize tracking-widest text-white">
        {type}
      </span>
    </div>
  );
};

export interface BaseOperatorProps extends OperatorComponentProps {
  className?: string;
  symbol?: string;
  emptyText?: string;
}

export interface OperatorComponentProps {
  operator: OperatorItem;
  onUpdate: (updated: OperatorItem) => void;
  rootFormula?: OperatorItem | VariableItem | ConstantItem;
  onItemMoved?: (
    itemId: string,
    sourceParentId: string | undefined,
    targetOperatorId: string,
    item: OperatorItem | VariableItem | ConstantItem
  ) => void;
}

export const BaseOperator: FC<BaseOperatorProps> = ({
  operator,
  onUpdate,
  onItemMoved,
  className = '',
  symbol = '+',
  emptyText = 'Drop item here',
}) => {
  const handleOperatorDrop = (item: DragItem) => {
    if (!item || item.id === operator.id) return;

    if (!item.isNew && item.sourceParentId) {
      onItemMoved?.(item.id, item.sourceParentId, operator.id, item.item);
      return;
    }

    onUpdate({
      ...operator,
      args: [...operator.args, item.item],
    });
  };

  return (
    <div className="relative inline-flex">
      <OperatorLabel type={operator.type} />
      <DropTarget
        onDrop={handleOperatorDrop}
        className={`rounded-r-md border p-2 shadow-subtle transition-all duration-200 ${className}`}
        id={operator.id}
      >
        <div className="flex flex-wrap items-center gap-2">
          {operator.args.length === 0 ? (
            <div
              className={`flex min-h-[40px] w-full min-w-[120px] items-center justify-center rounded-md border border-dashed p-4 ${className}`}
            >
              <span className="text-foreground/50 text-sm">{emptyText}</span>
            </div>
          ) : (
            operator.args.map((arg, i) => (
              <div key={arg.id} className="flex items-center">
                {i > 0 && (
                  <span className="mx-1 text-lg font-medium">{symbol}</span>
                )}
                <FormulaItem
                  item={arg}
                  onUpdate={(updated) => {
                    const newArgs = [...operator.args];
                    newArgs[i] = updated;
                    onUpdate({ ...operator, args: newArgs });
                  }}
                  parentId={operator.id}
                  rootFormula={operator}
                  onItemMoved={onItemMoved}
                />
              </div>
            ))
          )}
        </div>
      </DropTarget>
    </div>
  );
};
