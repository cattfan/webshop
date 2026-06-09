import React from 'react';
import { cn } from './cn';

type Tone = 'solid' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = 'outline', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium uppercase tracking-wide',
        tone === 'solid' ? 'bg-ink text-paper' : 'border border-line-strong text-ink',
        className,
      )}
      {...props}
    />
  );
}

