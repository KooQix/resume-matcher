import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ToasterProvider from "@/providers/ToastProvider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Find Me A Job",
	description: "Application to find matching offers for job seekers",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{/* Enable toast messages */}
				<ToasterProvider />
				{children}
			</body>
		</html>
	);
}
