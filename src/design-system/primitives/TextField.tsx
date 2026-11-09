import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, error, success, leftIcon, className = '', disabled, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-slate-900 tracking-tight">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full rounded-md border bg-white text-slate-900 placeholder:text-slate-500 text-sm py-2.5 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-400 ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } pr-10 ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : success
                ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200'
                : 'border-slate-200 focus:border-nutri-teal-600 focus:ring-nutri-teal-100'
            } ${className}`}
            {...props}
          />

          <div className="absolute right-3 flex items-center pointer-events-none">
            {error && <AlertCircle className="w-4 h-4 text-red-500" />}
            {success && !error && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </div>
        </div>

        {error ? (
          <p className="text-xs font-semibold text-red-600 leading-normal flex items-center gap-1">
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs font-medium text-[#4B5563] leading-normal">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
