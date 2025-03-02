import { OperatorType } from './formula';

export type AggregationType = 'median' | 'average' | 'integration' | 'sum';

export interface Variable {
  uuid: string;
  displayName: string;
}

export interface FormulaNode {
  type: OperatorType | 'variable' | 'constant';
  value?: string | number; // variable id or number value
  params?: FormulaNode[];
}

export interface KPI {
  id: string;
  name: string;
  conditioning: string;
  formula: FormulaNode;
  aggregationType: AggregationType;
  createdAt: Date;
  updatedAt: Date;
}

export const predefinedVariables = [
  { uuid: 'v1', displayName: 'Temperature' },
  { uuid: 'v2', displayName: 'Pressure' },
  { uuid: 'v3', displayName: 'Flow Rate' },
  { uuid: 'v4', displayName: 'Humidity' },
] as const;

export const operators: { type: OperatorType; symbol: string }[] = [
  { type: 'add', symbol: '+' },
  { type: 'subtract', symbol: '-' },
  { type: 'multiply', symbol: '×' },
  { type: 'divide', symbol: '÷' },
];
