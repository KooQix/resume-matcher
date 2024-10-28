import React from "react";
import { twMerge } from "tailwind-merge";

// Reuse forwardRef to "inherit" from Html input element
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, disabled, ...props }, ref) => {
		return (
			<div className="w-full">
				<input
					type={type}
					className={twMerge(
						"flex w-full rounded-md bg-slate-200/90 border border-transparent px-2 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none text-slate-800",
						className,
					)}
					disabled={disabled}
					ref={ref}
					{...props}
				/>
			</div>
		);
	},
);

Input.displayName = "Input";
export default Input;
