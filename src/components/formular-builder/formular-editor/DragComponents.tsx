import { FC } from 'react';
import { FormulaItemType } from '../../../types/formula';
import {
  DragItem,
  useDraggableItem,
  useDropTarget,
} from '../../../utils/dragAndDrop';

// Props for DraggableItem component
export interface DraggableItemProps {
  item: FormulaItemType;
  isNew?: boolean;
  parentId?: string; // Pass the parent ID to track where the item came from
  children: React.ReactNode;
  isTopmostOperator?: boolean; // New prop to determine if the item is the topmost operator
  onItemDelete?: (id: string) => void;
}

// Component for draggable items
export const DraggableItem: FC<DraggableItemProps> = ({
  item,
  isNew = false,
  parentId,
  children,
  isTopmostOperator = false,
  onItemDelete = () => {},
}) => {
  const { dragRef, dragProps } = useDraggableItem(item, {
    isNew,
    parentId,
    isTopmostOperator,
  });

  return (
    <div ref={dragRef} {...dragProps}>
      {children}
      <div className="delete-button">
        <div className="pointer-events-auto absolute -right-2 -top-2 transition-opacity group-hover/constant:opacity-100">
          <button
            onClick={() => onItemDelete(item.id)}
            className="rounded-full bg-red-100 p-1 text-red-600 shadow-sm hover:bg-red-200"
            title="Remove item"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325c.827-.05 1.66-.075 2.5-.075z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Props for DropTarget component
interface DropTargetProps {
  onDrop: (item: DragItem) => void;
  canDrop?: (item: DragItem) => boolean;
  children: React.ReactNode;
  className?: string;
  id?: string; // Unique ID for this drop target
}

// Component for drop targets
export const DropTarget: FC<DropTargetProps> = ({
  onDrop,
  canDrop,
  children,
  className = '',
  id,
}) => {
  const { dropRef, dropProps } = useDropTarget(onDrop, {
    id,
    canDrop,
  });

  return (
    <div
      ref={dropRef}
      className={`${className} ${dropProps.className}`}
      data-drop-id={id}
    >
      {children}
    </div>
  );
};
