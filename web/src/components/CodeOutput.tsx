import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Terminal } from 'lucide-react';

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
        'mt-0 p-5 rounded-xl font-mono text-sm border transition-colors duration-200',
        type === 'success' 
          ? 'bg-zinc-900 border-green-500/20 text-green-400'
          : 'bg-zinc-900 border-red-500/20 text-red-400'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {type === 'success' ? (
            <div className="p-1.5 rounded-lg bg-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-zinc-800">
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
          )}
          <span className={cn(
            'text-xs uppercase tracking-wider font-medium',
            type === 'success' ? 'text-green-400/90' : 'text-red-400/90'
          )}>
            {type}
          </span>
        </div>
        <div className="flex items-center gap-1.5 opacity-50">
          <Terminal className="w-3 h-3" />
          <span className="text-[10px] uppercase tracking-wider">Output</span>
        </div>
      </div>
      
      <div className={cn(
        'mt-4 font-mono text-sm leading-relaxed break-words rounded-lg p-3',
        type === 'success' 
          ? 'bg-zinc-800 text-green-300/90'
          : 'bg-zinc-800 text-red-300/90'
      )}>
        {output}
      </div>
    </div>
  );
};
