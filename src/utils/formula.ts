import { v4 as uuidv4 } from 'uuid';
import {
  FormulaItemType,
  OperatorItem,
  VariableItem,
  ConstantItem,
  OperatorType,
  VariableType,
} from '../types/formula';

export const createOperator = (
  type: OperatorType,
  args: FormulaItemType[] = []
): OperatorItem => ({
  id: uuidv4(),
  type,
  args,
});

export const createVariable = (variable: VariableType): VariableItem => ({
  id: uuidv4(),
  type: 'variable',
  variable,
});

export function createConstant(): ConstantItem {
  return {
    id: `const_${Math.random().toString(36).substr(2, 9)}`,
    type: 'constant',
    value: 0,
  };
}

export const addArgToOperator = (
  operator: OperatorItem,
  item: FormulaItemType
): OperatorItem => {
  return {
    ...operator,
    args: [...operator.args, item],
  };
};

export const removeArgFromOperator = (
  operator: OperatorItem,
  argId: string
): OperatorItem => {
  return {
    ...operator,
    args: operator.args.filter((arg) => arg.id !== argId),
  };
};

export const replaceOperatorInFormula = (
  formula: FormulaItemType,
  operatorId: string,
  newOperator: FormulaItemType
): FormulaItemType => {
  if (formula.id === operatorId) {
    return newOperator;
  }

  if ('args' in formula) {
    return {
      ...formula,
      args: formula.args.map((arg) =>
        'args' in arg
          ? replaceOperatorInFormula(arg, operatorId, newOperator)
          : arg
      ),
    };
  }

  return formula;
};

export const addItemToOperator = (
  formula: FormulaItemType,
  operatorId: string,
  item: FormulaItemType
): FormulaItemType => {
  if (formula.id === operatorId && 'args' in formula) {
    return {
      ...formula,
      args: [...formula.args, item],
    };
  }

  if ('args' in formula) {
    return {
      ...formula,
      args: formula.args.map((arg) =>
        'args' in arg ? addItemToOperator(arg, operatorId, item) : arg
      ),
    };
  }

  return formula;
};

export const removeItemFromFormula = (
  formula: FormulaItemType,
  itemId: string
): FormulaItemType | null => {
  if (formula.id === itemId) {
    return null;
  }
  if ('args' in formula) {
    return {
      ...formula,
      args: formula.args
        .map((arg) =>
          arg.id === itemId
            ? null
            : 'args' in arg
              ? removeItemFromFormula(arg, itemId)
              : arg
        )
        .filter((arg) => arg !== null) as FormulaItemType[],
    };
  }
  return formula;
};

export const findItemInFormula = (
  formula: FormulaItemType,
  itemId: string
): FormulaItemType | null => {
  if (formula.id === itemId) {
    return formula;
  }

  if ('args' in formula) {
    for (const arg of formula.args) {
      const found = findItemInFormula(arg, itemId);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

export const findParentInFormula = (
  formula: FormulaItemType,
  itemId: string
): OperatorItem | null => {
  if ('args' in formula) {
    if (formula.args.some((arg) => arg.id === itemId)) {
      return formula;
    }

    for (const arg of formula.args) {
      if ('args' in arg) {
        const found = findParentInFormula(arg, itemId);
        if (found) {
          return found;
        }
      }
    }
  }

  return null;
};

export function isFormulaValid(formula: FormulaItemType | null): boolean {
  if (!formula) return false;

  if (formula.type === 'variable' || formula.type === 'constant') {
    return true;
  }

  // For operators, check if they have at least one argument and all args are valid
  return (
    formula.args.length > 0 && formula.args.every((arg) => isFormulaValid(arg))
  );
}
