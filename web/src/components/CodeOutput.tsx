import React from 'react';
import { cn } from '@/lib/utils';

interface CodeOutputProps {
  output: string;
  type: 'success' | 'error';
  show: boolean;
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ output, type, show }) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        'mt-0 p-4 rounded-lg font-mono text-sm border transition-all',
        type === 'success' 
          ? 'bg-zinc-800 border-green-600/20 text-green-400'
          : 'bg-zinc-800 border-red-600/20 text-red-400'
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-2 h-2 rounded-full',
          type === 'success' ? 'bg-green-400' : 'bg-red-400'
        )} />
        <span className={cn(
          'text-xs uppercase font-semibold',
          type === 'success' ? 'text-green-400' : 'text-red-400'
        )}>
          {type}
        </span>
      </div>
      <div className="mt-2 font-mono">
        {output}
      </div>
    </div>
  );
};
