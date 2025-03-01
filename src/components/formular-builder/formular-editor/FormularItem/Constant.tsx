import { FC, useState } from 'react';
import { ConstantItem } from '../../../../types/formula';

export interface ConstantComponentProps {
  constant: ConstantItem;
  onUpdate?: (updated: ConstantItem) => void;
}

export const Constant: FC<ConstantComponentProps> = ({
  constant,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(!constant.value);
  const [value, setValue] = useState(constant.value.toString());

  const handleBlur = () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdate?.({ ...constant, value: numValue });
      setIsEditing(false);
    }
  };

  return (
    <div className="constant-container group/constant pointer-events-none relative isolate flex items-center justify-between rounded-md border border-gray-dark bg-background p-2 text-gray-dark shadow-subtle">
      {isEditing ? (
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          className="border-foreground/20 focus:border-primary/50 pointer-events-auto w-20 border-b bg-transparent px-2 py-1 font-mono text-sm focus:outline-none"
          autoFocus
        />
      ) : (
        <span
          className="variable-value pointer-events-auto cursor-pointer font-mono font-medium text-foreground"
          onClick={() => setIsEditing(true)}
        >
          {constant.value}
        </span>
      )}
    </div>
  );
};
