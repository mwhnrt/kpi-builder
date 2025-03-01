import { FC } from 'react';
import type {
  OperatorItem,
  VariableItem,
  ConstantItem,
} from '../../../../types/formula';
import { DraggableItem } from '../DragComponents';
import { Variable } from './Variable';
import { Constant } from './Constant';
import {
  AddOperator,
  SubtractOperator,
  MultiplyOperator,
  DivideOperator,
} from './Operators';
import { useFormula } from '../FormulaContext';

interface FormulaItemProps {
  item: OperatorItem | VariableItem | ConstantItem;
  onUpdate?: (updated: OperatorItem | VariableItem | ConstantItem) => void;
  onRemove?: () => void;
  parentId?: string;
  rootFormula?: OperatorItem | VariableItem | ConstantItem;
  onItemMoved?: (
    itemId: string,
    sourceParentId: string | undefined,
    targetOperatorId: string,
    item: OperatorItem | VariableItem | ConstantItem
  ) => void;
}

export const FormulaItem: FC<FormulaItemProps> = ({
  item,
  onUpdate,
  parentId,
  rootFormula,
  onItemMoved,
}) => {
  const { handleDeleteItem } = useFormula();

  const commonProps = {
    item,
    parentId,
    isTopmostOperator: !parentId, // Set isTopmostOperator to true if there is no parentId
    onItemDelete: handleDeleteItem,
  };

  if (item.type === 'variable') {
    return (
      <DraggableItem {...commonProps}>
        <Variable variable={item as VariableItem} />
      </DraggableItem>
    );
  }

  if (item.type === 'constant') {
    return (
      <DraggableItem {...commonProps}>
        <Constant constant={item as ConstantItem} onUpdate={onUpdate} />
      </DraggableItem>
    );
  }

  const operatorProps = {
    operator: item,
    onUpdate: onUpdate || (() => {}),
    rootFormula,
    onItemMoved,
  };

  return (
    <DraggableItem {...commonProps}>
      {item.type === 'add' ? (
        <AddOperator {...operatorProps} />
      ) : item.type === 'subtract' ? (
        <SubtractOperator {...operatorProps} />
      ) : item.type === 'multiply' ? (
        <MultiplyOperator {...operatorProps} />
      ) : (
        <DivideOperator {...operatorProps} />
      )}
    </DraggableItem>
  );
};
