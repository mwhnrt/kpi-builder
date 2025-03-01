import { FC } from 'react';
import { VariableItem } from '../../../../types/formula';
import { variableLabels } from '../../../../utils/constants';

export interface VariableComponentProps {
  variable: VariableItem;
}

export const Variable: FC<VariableComponentProps> = ({ variable }) => (
  <div className="variable-container border-foreground/10 relative flex items-center justify-between rounded-md border bg-background p-2 shadow-subtle">
    <span className="variable-value font-mono font-medium text-foreground">
      {variableLabels[variable.variable] || variable.variable}
    </span>
  </div>
);
