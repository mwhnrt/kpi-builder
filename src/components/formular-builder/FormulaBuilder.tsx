import {
  FormulaItemType,
  OperatorType,
  VariableType,
} from '../../types/formula';
import { DraggableItem, DropTarget } from './formular-editor/DragComponents';
import { FormulaItem } from './formular-editor/FormularItem/FormulaItem';
import { variableLabels } from '../../utils/constants';
import {
  createOperator,
  createVariable,
  createConstant,
} from '../../utils/formula';
import { generateFormulaPreview } from '../../utils/formulaDisplay';
import { DragItem } from '../../utils/dragAndDrop';
import { useFormula } from './formular-editor/FormulaContext';

// Define operator symbols for better readability
const OPERATOR_SYMBOLS = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

// Define operator background colors
const OPERATOR_BACKGROUNDS = {
  add: 'bg-[var(--operator-add)]',
  subtract: 'bg-[var(--operator-subtract)]',
  multiply: 'bg-[var(--operator-multiply)]',
  divide: 'bg-[var(--operator-divide)]',
};

const getFormulaEditorClassName = (
  formula: FormulaItemType | null,
  valid: boolean
) => {
  const baseClasses =
    'formula-editor flex flex-col items-center justify-center rounded-lg p-4 shadow-subtle';

  if (!formula) {
    return `${baseClasses} border-foreground/10 border bg-background-alt`;
  }

  return valid
    ? `${baseClasses} bg-success/5 border-success/20 border`
    : `${baseClasses} bg-danger/5 border-danger/20 border`;
};

export function FormulaBuilder() {
  // Use the formula context
  const {
    formula,
    isFormulaValid: valid,
    handleItemDroppedIntoOperator,
    handleFormulaUpdate,
    handleFormulaRemove,
    handleDeleteItem,
  } = useFormula();

  const handleRootDrop = (item: DragItem) => {
    if (!item) return;

    let newFormula: FormulaItemType;

    if (item.isNew) {
      // New item being added from the toolbox
      newFormula = item.item;
    } else if (formula?.id === item.id) {
      // The item is the current root, do nothing
      return;
    } else {
      // Existing item being moved to root
      newFormula = item.item;

      // If it was moved from inside another operator, remove it from there
      if (item.sourceParentId && formula) {
        handleItemDroppedIntoOperator(
          item.id,
          item.sourceParentId,
          'root',
          item.item
        );
        return; // The effect will handle updating the formula
      }
    }

    handleFormulaUpdate(newFormula);
  };

  // These are the items in the toolbox
  const operatorTypes: OperatorType[] = [
    'add',
    'subtract',
    'multiply',
    'divide',
  ];
  const variableTypes: VariableType[] = ['v1', 'v2', 'v3', 'v4'];

  return (
    <div className="formula-builder">
      {/* Toolbox Section */}
      <div className="toolbox mb-6 rounded-lg bg-background-alt p-4 shadow-subtle">
        <div className="flex flex-row justify-center gap-2">
          {/* Operator Tools */}
          {operatorTypes.map((type) => (
            <DraggableItem key={type} item={createOperator(type)} isNew={true}>
              <div
                className={`p-2 ${OPERATOR_BACKGROUNDS[type]} cursor-move rounded-md border text-center text-white transition-shadow hover:shadow-subtle`}
              >
                {OPERATOR_SYMBOLS[type]}{' '}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </DraggableItem>
          ))}

          {/* Variable Tools */}
          {variableTypes.map((variable) => (
            <DraggableItem
              key={variable}
              item={createVariable(variable)}
              isNew={true}
            >
              <div className="border-foreground/10 cursor-move rounded-md border bg-background p-2 text-center transition-shadow hover:shadow-subtle">
                {variableLabels[variable]}
              </div>
            </DraggableItem>
          ))}

          {/* Constant Tool */}
          <DraggableItem item={createConstant()} isNew={true}>
            <div className="border-foreground/10 cursor-move rounded-md border bg-gray-dark p-2 text-center text-white transition-shadow hover:shadow-subtle">
              Constant
            </div>
          </DraggableItem>
        </div>
      </div>

      {/* Formula Section */}
      <div className="formula-section">
        <div className={getFormulaEditorClassName(formula, valid)}>
          {!formula ? (
            <DropTarget
              onDrop={handleRootDrop}
              className="border-foreground/20 hover:border-primary/50 flex min-h-[120px] items-center justify-center rounded-lg border border-dashed transition-colors"
            >
              <div className="text-center">
                <p className="text-foreground/60 mb-2">
                  Drag formula components here
                </p>
                <p className="text-foreground/40 text-xs">
                  Start with an operator or variable
                </p>
              </div>
            </DropTarget>
          ) : (
            <div>
              <FormulaItem
                item={formula}
                onUpdate={handleFormulaUpdate}
                onRemove={handleFormulaRemove}
                rootFormula={formula}
                onItemMoved={handleItemDroppedIntoOperator}
                onItemDelete={handleDeleteItem}
              />
            </div>
          )}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div>
            {formula && !valid && (
              <div className="mt-4 text-sm text-danger">
                <span className="font-medium">Invalid formula:</span> Operators
                must have at least one argument
              </div>
            )}
          </div>
          {formula && (
            <button
              onClick={handleFormulaRemove}
              className="px-2 py-1 text-sm text-danger hover:text-danger/80"
            >
              Clear Formula
            </button>
          )}
        </div>

        {/* Formula Preview */}
        {formula && (
          <div className="mt-4 rounded-md bg-background-alt p-3 shadow-subtle">
            <h4 className="text-foreground/70 mb-1 text-sm font-medium">
              Formula Preview:
            </h4>
            <div className="text-foreground">
              {generateFormulaPreview(formula)}
            </div>
          </div>
        )}
      </div>

      <div className="text-foreground/60 mt-4 text-sm">
        <p>
          Drag items from the toolbox to build your formula. You can add
          multiple items to operators.
        </p>
        <p>Items can be rearranged by dragging them to a new position.</p>
      </div>
    </div>
  );
}
