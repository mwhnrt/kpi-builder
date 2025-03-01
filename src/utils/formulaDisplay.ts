import { FormulaItemType } from '../types/formula';
import { variableLabels } from './constants';

export const generateFormulaPreview = (
  item: FormulaItemType | null
): string => {
  if (!item) return '';

  if (item.type === 'variable') {
    return variableLabels[item.variable] || item.variable;
  }

  if (item.type === 'constant') {
    return item.value.toString();
  }

  if (item.args.length === 0) {
    return '(empty)';
  }

  let symbol;
  switch (item.type) {
    case 'add':
      symbol = ' + ';
      break;
    case 'subtract':
      symbol = ' - ';
      break;
    case 'multiply':
      symbol = ' × ';
      break;
    default:
      symbol = ' ÷ ';
  }

  return (
    '( ' +
    item.args.map((arg) => generateFormulaPreview(arg)).join(symbol) +
    ' )'
  );
};
