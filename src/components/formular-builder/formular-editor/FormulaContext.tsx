import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { FormulaItemType } from '@/types/formula';
import {
  isFormulaValid,
  findParentInFormula,
  replaceOperatorInFormula,
  addItemToOperator,
  removeArgFromOperator,
  removeItemFromFormula,
} from '@/utils/formula';

// Define the shape of our context
interface FormulaContextType {
  formula: FormulaItemType | null;
  setFormula: (formula: FormulaItemType | null) => void;
  isFormulaValid: boolean;
  handleItemDroppedIntoOperator: (
    itemId: string,
    sourceParentId: string | undefined,
    targetOperatorId: string,
    item: FormulaItemType
  ) => void;
  handleFormulaUpdate: (updated: FormulaItemType | null) => void;
  handleFormulaRemove: () => void;
  handleDeleteItem: (itemId: string) => void;
}

// Create the context with a default value
const FormulaContext = createContext<FormulaContextType | undefined>(undefined);

// Props for the provider component
interface FormulaProviderProps {
  children: ReactNode;
  initialFormula?: FormulaItemType | null;
  onChange?: (formula: FormulaItemType | null, isValid: boolean) => void;
}

// Provider component that wraps parts of our app that need the context
export function FormulaProvider({
  children,
  initialFormula = null,
  onChange = () => {},
}: FormulaProviderProps) {
  const [formula, setFormula] = useState<FormulaItemType | null>(
    initialFormula
  );

  // Memoize the formula validation to prevent unnecessary recalculations
  const formulaValid = useMemo(
    () => (formula ? isFormulaValid(formula) : false),
    [formula]
  );

  const handleFormulaUpdate = useCallback(
    (updated: FormulaItemType | null) => {
      setFormula(updated);
      onChange(updated, updated ? isFormulaValid(updated) : false);
    },
    [onChange]
  );

  // This handles when an item is moved between operators
  const handleItemDroppedIntoOperator = useCallback(
    (
      itemId: string,
      sourceParentId: string | undefined,
      targetOperatorId: string,
      item: FormulaItemType
    ) => {
      if (!formula || !sourceParentId) return;

      // Find the source parent and remove the item from it
      const sourceParent = findParentInFormula(formula, itemId);
      if (!sourceParent) return; // Can't find where to remove from

      // Remove item from its current location
      const updatedSourceParent = removeArgFromOperator(sourceParent, itemId);
      let updatedFormula = replaceOperatorInFormula(
        formula,
        sourceParent.id,
        updatedSourceParent
      );

      if (targetOperatorId === 'root') {
        setFormula(item);
        onChange(item, isFormulaValid(item));
        return;
      }

      // Add the item to its target operator
      updatedFormula = addItemToOperator(
        updatedFormula,
        targetOperatorId,
        item
      );

      // Update the formula state
      setFormula(updatedFormula);
      onChange(updatedFormula, isFormulaValid(updatedFormula));
    },
    [formula, onChange]
  );

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      if (!formula) return;

      // If we're deleting the root formula, clear the formula
      if (formula.id === itemId) {
        setFormula(null);
        onChange(null, false);
        return;
      }

      // Otherwise remove the item from within the formula
      const newFormula = removeItemFromFormula(formula, itemId);

      // Update the formula state
      setFormula(newFormula);
      onChange(newFormula, newFormula ? isFormulaValid(newFormula) : false);
    },
    [formula, onChange]
  );

  const handleFormulaRemove = useCallback(() => {
    setFormula(null);
    onChange(null, false);
  }, [onChange]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      formula,
      setFormula,
      isFormulaValid: formulaValid,
      handleItemDroppedIntoOperator,
      handleFormulaUpdate,
      handleFormulaRemove,
      handleDeleteItem,
    }),
    [
      formula,
      formulaValid,
      handleItemDroppedIntoOperator,
      handleFormulaUpdate,
      handleFormulaRemove,
      handleDeleteItem,
    ]
  );

  return (
    <FormulaContext.Provider value={contextValue}>
      {children}
    </FormulaContext.Provider>
  );
}

// Custom hook to use the formula context
export function useFormula() {
  const context = useContext(FormulaContext);
  if (context === undefined) {
    throw new Error('useFormula must be used within a FormulaProvider');
  }
  return context;
}
