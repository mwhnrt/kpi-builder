import { ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormulaProvider } from './FormulaContext';
import { FormulaItemType } from '@/types/formula';

interface FormulaEditorProviderProps {
  children: ReactNode;
  initialFormula?: FormulaItemType | null;
  onChange?: (formula: FormulaItemType | null, isValid: boolean) => void;
}

export function FormulaEditorProvider({
  children,
  initialFormula = null,
  onChange = () => {},
}: FormulaEditorProviderProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormulaProvider initialFormula={initialFormula} onChange={onChange}>
        {children}
      </FormulaProvider>
    </DndProvider>
  );
}
