"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
	return (
		<Toaster
			toastOptions={{
				style: {
					// background: "#f1f5f9",
					// color: "#64748b",
					background: "white",
					color: "#6366f1",
					fontStyle: "bold",
				},
			}}
		/>
	);
};

export default ToasterProvider;
