import { FormulaItemType } from '@/types/formula';
import { useDrag, useDrop } from 'react-dnd';

// Define DragItem type used in drag and drop operations
export interface DragItem {
  id: string;
  type: string;
  item: FormulaItemType;
  isNew: boolean;
  sourceParentId?: string;
}

// Custom hook for creating a draggable item
export function useDraggableItem(
  item: FormulaItemType,
  options: {
    isNew?: boolean;
    parentId?: string;
    isTopmostOperator?: boolean;
  } = {}
) {
  const { isNew = false, parentId, isTopmostOperator = false } = options;

  const [{ isDragging }, dragRef] = useDrag<
    DragItem,
    unknown,
    { isDragging: boolean }
  >({
    type: 'FORMULA_ITEM',
    item: () => ({
      id: item.id,
      type: item.type,
      item: isNew ? { ...item } : item,
      isNew,
      sourceParentId: parentId,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isTopmostOperator,
  });

  return {
    isDragging,
    dragRef,
    dragProps: {
      'data-drag-id': item.id,
      'data-parent-id': parentId || 'none',
      style: { cursor: isTopmostOperator ? 'default' : 'move' },
      className: `hover-target relative formula-item transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`,
    },
  };
}

// Validate if an item can be dropped on a target
export function validateDropTarget(item: DragItem, targetId?: string): boolean {
  // Don't allow dropping an item back into itself
  if (item.id === targetId) return false;

  return true;
}

// Custom hook for creating a drop target
export function useDropTarget(
  onDrop: (item: DragItem) => void,
  options: {
    id?: string;
    canDrop?: (item: DragItem) => boolean;
  } = {}
) {
  const { id, canDrop } = options;

  const [{ isOver, canDropItem }, dropRef] = useDrop<
    DragItem,
    unknown,
    { isOver: boolean; canDropItem: boolean }
  >({
    accept: 'FORMULA_ITEM',
    drop: (item: DragItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      onDrop(item);
    },
    canDrop: (item: DragItem) => {
      if (!validateDropTarget(item, id)) return false;
      return canDrop ? canDrop(item) : true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDropItem: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDropItem;

  return {
    isOver,
    canDrop: canDropItem,
    isActive,
    dropRef,
    dropProps: {
      'data-drop-id': id,
      className: `transition-all duration-200 ${isActive ? 'ring-2 ring-primary ring-opacity-30' : ''}`,
    },
  };
}
