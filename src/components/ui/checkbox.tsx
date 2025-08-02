'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: 'circle' | 'square';
  size?: 'sm' | 'md' | 'lg';
  activeColor?: string;
  inactiveColor?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * A production-grade Checkbox component with support for multiple variants, sizes, colors, and icons.
 * @param {string} id - Unique identifier for the checkbox.
 * @param {string} name - Name of the checkbox (useful in forms).
 * @param {boolean} checked - Whether the checkbox is checked or not.
 * @param {function} onChange - Callback triggered when the checkbox state changes.
 * @param {string} variant - The shape of the checkbox (circle or square).
 * @param {string} size - The size of the checkbox (sm, md, lg).
 * @param {string} activeColor - Background color when the checkbox is checked.
 * @param {string} inactiveColor - Background color when the checkbox is unchecked.
 * @param {React.ReactNode} icon - Icon to display when the checkbox is checked.
 * @param {string} className - Additional class names for custom styling.
 * @returns {JSX.Element} - The Checkbox component.
 * @example
 * <Checkbox
 *   id="example-checkbox"
 *   name="exampleCheckbox"
 *   checked={isChecked}
 *   onChange={(e) => setIsChecked(e.target.checked)}
 *   variant="circle"
 *   activeColor="bg-blue-500"
 *   inactiveColor="bg-gray-300"
 *   icon={<FiCheck className="text-white" />}
 *   size="md"
 *   className="custom-class"
 * />
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  variant = 'square',
  size = 'md',
  activeColor = 'bg-blue-500',
  inactiveColor = 'bg-gray-300',
  icon = <Check className="text-black" />,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center', className)}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={cn(
          'flex items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out border',
          sizeClasses[size],
          checked ? activeColor : inactiveColor,
          variant === 'circle' ? 'rounded-full' : '',
        )}
      >
        {checked && icon}
      </label>
    </div>
  );
};
