import type { Metadata } from "next";
import { Suspense } from "react";
import { QueryProvider } from "@/shared/components/providers/query-provider";
import { ThemeProvider } from "@/shared/components/providers/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import "./globals.css";
import { inter } from "@/public/fonts/font_index";

const faviconVersion = "20260407";

export const metadata: Metadata = {
	title: {
		default: "Dinheir{IN}",
		template: "%s | Dinheir{IN}",
	},
	description:
		"Controle suas finanças pessoais de forma simples e transparente.",
	icons: {
		icon: [
			{ url: `/favicon.ico?v=${faviconVersion}`, type: "image/x-icon" },
			{
				url: `/favicon-32x32.png?v=${faviconVersion}`,
				sizes: "32x32",
				type: "image/png",
			},
			{
				url: `/favicon-16x16.png?v=${faviconVersion}`,
				sizes: "16x16",
				type: "image/png",
			},
		],
		apple: [{ url: `/apple-touch-icon.png?v=${faviconVersion}`, sizes: "180x180" }],
	},
	manifest: `/site.webmanifest?v=${faviconVersion}`,
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
				<link rel="shortcut icon" href={`/favicon.ico?v=${faviconVersion}`} />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href={`/apple-touch-icon.png?v=${faviconVersion}`}
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href={`/favicon-32x32.png?v=${faviconVersion}`}
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href={`/favicon-16x16.png?v=${faviconVersion}`}
				/>
				<link rel="manifest" href={`/site.webmanifest?v=${faviconVersion}`} />
				<meta name="apple-mobile-web-app-title" content="OpenMonetis" />
				<meta name="msapplication-TileColor" content="#ffffff" />
				<meta name="theme-color" content="#ffffff" />
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
