import React from "react";
import RingLoader from "react-spinners/RingLoader";
import { twMerge } from "tailwind-merge";

interface LoaderProps {
	title: string;
	className?: string;
}

const Loader: React.FC<LoaderProps> = ({ title, className }) => {
	return (
		<div
			className={twMerge(
				"w-full h-full flex flex-col justify-center items-center absolute top-0 left-0 bg-white bg-opacity-70",
				className,
			)}
		>
			<RingLoader color="#3b82f6" />
			<p className="text-blue-500 mt-10">{title}</p>
		</div>
	);
};

export default Loader;
