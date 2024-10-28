import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

// Forward  / extends normal HTMLButtonElement to get attributes that regular buttons have
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, children, disabled, type = "button", ...props }, ref) => {
		return (
			<button
				type={type}
				className={twMerge(
					`
					w-fit
					rounded-md
					bg-blue-500
					border
					border-transparent
					pt-2
					pb-2
					pr-6
					pl-6
					disabled:cursor-not-allowed 
					disabled:opacity-50
					text-white
					font-bold
					hover:opacity-75
					transition
				`,
					disabled && "opacity-75 cursor-not-allowed",
					className,
				)}
				disabled={disabled}
				ref={ref}
				{...props}
			>
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";

export default Button;

interface CancelButtonProps {
	title?: string;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
}
export const CancelButton: React.FC<CancelButtonProps> = ({
	title,
	onClick,
	className,
	disabled,
}) => {
	return (
		<Button
			className={twMerge(
				"w-[25%] bg-transparent text-slate-600 hover:bg-slate-200/40 p-2",
				className,
			)}
			onClick={onClick}
			disabled={disabled}
		>
			{title ?? "Cancel"}
		</Button>
	);
};
