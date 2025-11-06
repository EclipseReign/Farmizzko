import React from 'react';
import { cn } from '../../lib/utils';

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-gray-200',
      className
    )}
    {...props}
  >
    <div
      className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
));

Progress.displayName = 'Progress';

export { Progress };
