export type OperatorType = 'add' | 'subtract' | 'multiply' | 'divide';
export type VariableType = 'v1' | 'v2' | 'v3' | 'v4';

export interface BaseItem {
  id: string;
  type: OperatorType | 'variable' | 'constant';
}

export interface OperatorItem extends BaseItem {
  type: OperatorType;
  args: (OperatorItem | VariableItem | ConstantItem)[];
}

export interface VariableItem extends BaseItem {
  type: 'variable';
  variable: VariableType;
}

export interface ConstantItem extends BaseItem {
  type: 'constant';
  value: number;
}

export type FormulaItemType = OperatorItem | VariableItem | ConstantItem;
