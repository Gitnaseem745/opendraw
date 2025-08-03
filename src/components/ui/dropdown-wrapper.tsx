import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SimpleDropdownWrapperProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}

export const SimpleDropdownWrapper: React.FC<SimpleDropdownWrapperProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className
}) => {
  const selectedOption = options.find(option => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full px-3 py-2 text-left bg-muted border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between",
            className
          )}
        >
          <span className="flex items-center gap-2">
            {selectedOption?.icon}
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full z-[1000]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SimpleDropdownWrapper;
