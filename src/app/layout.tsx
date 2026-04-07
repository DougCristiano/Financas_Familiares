import type { Metadata } from "next";
import { Suspense } from "react";
import { QueryProvider } from "@/shared/components/providers/query-provider";
import { ThemeProvider } from "@/shared/components/providers/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import "./globals.css";
import { inter } from "@/public/fonts/font_index";

export const metadata: Metadata = {
	title: {
		default: "f{IN}anças",
		template: "%s | f{IN}anças",
	},
	description:
		"Controle suas finanças pessoais de forma simples e transparente.",
	icons: {
		icon: [
			{
				url: "/favicons/favicon-16x16.png",
				type: "image/png",
				sizes: "16x16",
			},
		],
		apple: "/favicons/favicon-16x16.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			data-scroll-behavior="smooth"
			lang="pt-BR"
			className={`${inter.variable}`}
			suppressHydrationWarning
		>
			<head>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicons/favicon-16x16.png"
				/>
				<meta name="apple-mobile-web-app-title" content="OpenMonetis" />
				{process.env.UMAMI_URL && process.env.UMAMI_WEBSITE_ID && (
					<script
						defer
						src={`${process.env.UMAMI_URL}/script.js`}
						data-website-id={process.env.UMAMI_WEBSITE_ID}
						{...(process.env.UMAMI_DOMAINS
							? { "data-domains": process.env.UMAMI_DOMAINS }
							: {})}
					/>
				)}
			</head>
			<body className="subpixel-antialiased" suppressHydrationWarning>
				<ThemeProvider attribute="class" defaultTheme="light">
					<QueryProvider>
						<Suspense>{children}</Suspense>
						<Toaster position="top-right" />
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
