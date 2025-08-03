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
            "w-full px-3 py-2.5 text-left bg-background border border-border rounded-md shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors flex items-center justify-between text-sm",
            className
          )}
        >
          <span className="flex items-center gap-2.5">
            {selectedOption?.icon && (
              <span className="text-muted-foreground">{selectedOption.icon}</span>
            )}
            <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
              {selectedOption?.label || placeholder}
            </span>
          </span>
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className="w-[--radix-dropdown-menu-trigger-width] min-w-[220px] z-[1000]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2.5 cursor-pointer py-2.5 px-3"
          >
            {option.icon && (
              <span className="text-muted-foreground">{option.icon}</span>
            )}
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SimpleDropdownWrapper;
