import React from 'react';
import { cn } from './cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-sm border border-line-strong bg-paper px-3 text-sm text-ink',
        'placeholder:text-neutral-400 focus-visible:focus-ring',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

