import { FC } from 'react';
import { BaseOperator, OperatorComponentProps } from './BaseOperator';

export const AddOperator: FC<
  Omit<OperatorComponentProps, 'className' | 'symbol' | 'emptyText'>
> = (props) => (
  <BaseOperator
    {...props}
    className="border-[var(--operator-add)]"
    symbol="+"
    emptyText="Drop item here"
  />
);

export const SubtractOperator: FC<
  Omit<OperatorComponentProps, 'className' | 'symbol' | 'emptyText'>
> = (props) => (
  <BaseOperator
    {...props}
    className="border-[var(--operator-subtract)]"
    symbol="−"
    emptyText="Drop item here"
  />
);

export const MultiplyOperator: FC<
  Omit<OperatorComponentProps, 'className' | 'symbol' | 'emptyText'>
> = (props) => (
  <BaseOperator
    {...props}
    className="border-[var(--operator-multiply)]"
    symbol="×"
    emptyText="Drop item here"
  />
);

export const DivideOperator: FC<
  Omit<OperatorComponentProps, 'className' | 'symbol' | 'emptyText'>
> = (props) => (
  <BaseOperator
    {...props}
    className="border-[var(--operator-divide)]"
    symbol="÷"
    emptyText="Drop item here"
  />
);
