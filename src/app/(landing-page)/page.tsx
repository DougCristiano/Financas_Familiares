import {
	RiBankCard2Line,
	RiBarChartBoxLine,
	RiCalendarLine,
	RiCheckLine,
	RiCodeSSlashLine,
	RiDatabase2Line,
	RiDeviceLine,
	RiDownloadCloudLine,
	RiEyeOffLine,
	RiFileTextLine,
	RiFlashlightLine,
	RiGitBranchLine,
	RiGithubFill,
	RiInformationLine,
	RiLayoutGridLine,
	RiLineChartLine,
	RiLockLine,
	RiNotification3Line,
	RiPercentLine,
	RiPieChartLine,
	RiRobot2Line,
	RiShieldCheckLine,
	RiSmartphoneLine,
	RiStarLine,
	RiTeamLine,
	RiTimeLine,
	RiWalletLine,
} from "@remixicon/react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { AnimateOnScroll } from "@/features/landing/components/animate-on-scroll";
import { MobileNav } from "@/features/landing/components/mobile-nav";
import { SetupTabs } from "@/features/landing/components/setup-tabs";
import { AnimatedThemeToggler } from "@/shared/components/animated-theme-toggler";
import { Logo } from "@/shared/components/logo";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { DotPattern } from "@/shared/components/ui/dot-pattern";
import { getOptionalUserSession } from "@/shared/lib/auth/server";

async function fetchGitHubStats() {
	try {
		const res = await fetch(
			"https://api.github.com/repos/felipegcoutinho/openmonetis",
			{ next: { revalidate: 3600 } },
		);
		if (!res.ok) return { stars: 200, forks: 60 };
		const data = await res.json();
		return {
			stars: data.stargazers_count as number,
			forks: data.forks_count as number,
		};
	} catch {
		return { stars: 200, forks: 60 };
	}
}

const navbarActionClassName =
	"border-black/10 bg-transparent text-black/75 shadow-none hover:border-black/20 hover:bg-black/10 hover:text-black focus-visible:ring-black/20 data-[state=open]:bg-black/10 data-[state=open]:text-black";

type FeatureItem = {
	icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
	title: string;
	description: string;
	colorVar: string;
};

const mainFeatures: FeatureItem[] = [
	{
		icon: RiWalletLine,
		title: "Contas e transações",
		description:
			"Registre suas contas bancárias, cartões e dinheiro. Adicione receitas, despesas e transferências. Organize por categorias. Extratos detalhados por conta.",
		colorVar: "var(--data-9)",
	},
	{
		icon: RiPercentLine,
		title: "Parcelamentos avançados",
		description:
			"Controle completo de compras parceladas. Antecipe parcelas com cálculo automático de desconto. Veja análise consolidada de todas as parcelas em aberto.",
		colorVar: "var(--data-4)",
	},
	{
		icon: RiRobot2Line,
		title: "Insights com IA",
		description:
			"Análises financeiras geradas por IA (Claude, GPT, Gemini). Insights personalizados sobre seus padrões de gastos e recomendações inteligentes.",
		colorVar: "var(--data-8)",
	},
	{
		icon: RiBarChartBoxLine,
		title: "Relatórios e gráficos",
		description:
			"Dashboard com 20+ widgets interativos. Relatórios detalhados por categoria. Gráficos de evolução e comparativos. Exportação em PDF e Excel.",
		colorVar: "var(--data-5)",
	},
	{
		icon: RiBankCard2Line,
		title: "Faturas de cartão",
		description:
			"Cadastre seus cartões e acompanhe as faturas por período. Veja o que ainda não foi fechado. Controle limites, vencimentos e fechamentos.",
		colorVar: "var(--data-1)",
	},
	{
		icon: RiTeamLine,
		title: "Gestão colaborativa",
		description:
			"Compartilhe pagadores com permissões granulares (admin/viewer). Notificações automáticas por e-mail. Colabore em lançamentos compartilhados.",
		colorVar: "var(--data-3)",
	},
];

const extraFeatures: FeatureItem[] = [
	{
		icon: RiPieChartLine,
		title: "Categorias e orçamentos",
		description:
			"Crie categorias personalizadas e defina orçamentos mensais com indicadores visuais.",
		colorVar: "var(--data-7)",
	},
	{
		icon: RiFileTextLine,
		title: "Anotações e tarefas",
		description:
			"Notas de texto e listas de tarefas com checkboxes. Arquivamento para manter histórico.",
		colorVar: "var(--data-6)",
	},
	{
		icon: RiCalendarLine,
		title: "Calendário financeiro",
		description:
			"Visualize transações em calendário mensal. Nunca perca prazos de pagamentos.",
		colorVar: "var(--data-2)",
	},
	{
		icon: RiDownloadCloudLine,
		title: "Importação em massa",
		description: "Lance múltiplos lançamentos de uma vez",
		colorVar: "var(--data-9)",
	},
	{
		icon: RiEyeOffLine,
		title: "Modo privacidade",
		description:
			"Oculte valores sensíveis com um clique. Tema dark/light. Calculadora integrada.",
		colorVar: "var(--data-4)",
	},
	{
		icon: RiFlashlightLine,
		title: "Performance otimizada",
		description: "Sistema rápido e com alta performance",
		colorVar: "var(--data-5)",
	},
];

const screenshotSections = [
	{
		title: "Lançamentos",
		description: "Registre e organize todas as suas transações financeiras",
		lightSrc: "/images/preview-lancamentos-light.webp",
		darkSrc: "/images/preview-lancamentos-dark.webp",
	},
	{
		title: "Calendário",
		description: "Visualize suas finanças no calendário mensal",
		lightSrc: "/images/preview-calendario-light.webp",
		darkSrc: "/images/preview-calendario-dark.webp",
	},
	{
		title: "Cartões",
		description: "Acompanhe faturas, limites e vencimentos dos seus cartões",
		lightSrc: "/images/preview-cartao-light.webp",
		darkSrc: "/images/preview-cartao-dark.webp",
	},
];

const companionBanks = [
	{ name: "Nubank", logo: "/logos/nubank.png" },
	{ name: "Itaú", logo: "/logos/itau.png" },
	{ name: "Inter", logo: "/logos/interpj.png" },
	{ name: "Mercado Pago", logo: "/logos/mercadopago.png" },
	{ name: "Outros", logo: null },
];

const stackItems = [
	{
		icon: RiCodeSSlashLine,
		title: "Frontend",
		subtitle: "Next.js 16, TypeScript, Tailwind CSS, shadcn/ui",
		description: "Interface moderna e responsiva com React 19 e App Router",
		colorVar: "var(--data-3)",
	},
	{
		icon: RiDatabase2Line,
		title: "Backend",
		subtitle: "PostgreSQL 18, Drizzle ORM, Better Auth",
		description: "Banco relacional robusto com type-safe ORM",
		colorVar: "var(--data-9)",
	},
	{
		icon: RiShieldCheckLine,
		title: "Segurança",
		subtitle: "Better Auth com OAuth (Google) e autenticação por email",
		description: "Sessões seguras e proteção de rotas por middleware",
		colorVar: "var(--data-1)",
	},
	{
		icon: RiDeviceLine,
		title: "Deploy",
		subtitle:
			"Docker com multi-stage build, health checks e volumes persistentes",
		description: "Fácil de rodar localmente ou em qualquer servidor",
		colorVar: "var(--data-5)",
	},
];

const whoIsItForItems = [
	{
		icon: RiTimeLine,
		title: "Tem disciplina de registrar gastos",
		description:
			"Não se importa em dedicar alguns minutos por dia ou semana para manter tudo atualizado",
		colorVar: "var(--data-4)",
	},
	{
		icon: RiLockLine,
		title: "Quer controle total sobre seus dados",
		description:
			"Prefere hospedar seus próprios dados ao invés de depender de serviços terceiros",
		colorVar: "var(--data-9)",
	},
	{
		icon: RiLineChartLine,
		title: "Gosta de entender exatamente onde o dinheiro vai",
		description:
			"Quer visualizar padrões de gastos e tomar decisões informadas",
		colorVar: "var(--data-3)",
	},
];

export default async function Page() {
	const [session, headersList, githubStats] = await Promise.all([
		getOptionalUserSession(),
		headers(),
		fetchGitHubStats(),
	]);
	const hostname = headersList.get("host")?.replace(/:\d+$/, "");
	const publicDomain = process.env.PUBLIC_DOMAIN?.replace(
		/^https?:\/\//,
		"",
	).replace(/:\d+$/, "");
	const isPublicDomain = !!(publicDomain && hostname === publicDomain);

	return (
		<div className="flex min-h-screen flex-col">
			{/* Navigation */}
			<header className="sticky top-0 z-50 flex h-16 shrink-0 items-center bg-primary">
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-b from-white/8 via-transparent to-black/6" />
				</div>

				<div className="relative z-10 max-w-8xl mx-auto px-4 w-full flex h-full items-center justify-between">
					<Logo variant="compact" invertTextOnDark={false} />

					{/* Center Navigation Links */}
					<nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
						{[
							{ href: "#telas", label: "conheça as telas" },
							{ href: "#funcionalidades", label: "funcionalidades" },
							{ href: "#companion", label: "companion" },
							{ href: "#stack", label: "stack" },
							{ href: "#como-usar", label: "como usar" },
						].map(({ href, label }) => (
							<a
								key={href}
								href={href}
								className="rounded-md px-2 py-1.5 text-sm font-medium text-black/75 hover:text-black hover:bg-black/10 transition-colors"
							>
								{label}
							</a>
						))}
					</nav>

					<nav className="flex items-center gap-2 md:gap-3">
						<AnimatedThemeToggler className={navbarActionClassName} />
						{!isPublicDomain &&
							(session?.user ? (
								<Link prefetch href="/dashboard" className="hidden md:block">
									<Button
										variant="outline"
										size="sm"
										className="border-black/20 text-black/80 bg-transparent hover:bg-black/10 hover:text-black shadow-none"
									>
										Dashboard
									</Button>
								</Link>
							) : (
								<div className="hidden md:flex items-center gap-2">
									<Link href="/login">
										<Button
											variant="ghost"
											size="sm"
											className="text-black/75 hover:bg-black/10 hover:text-black shadow-none"
										>
											Entrar
										</Button>
									</Link>
									<Link href="/signup">
										<Button
											size="sm"
											className="bg-black/10 border border-black/20 text-black shadow-none hover:bg-black/20 gap-2"
										>
											Começar
										</Button>
									</Link>
								</div>
							))}
						<MobileNav
							isPublicDomain={isPublicDomain}
							isLoggedIn={!!session?.user}
							triggerClassName="border border-black/10 text-black/75 shadow-none hover:border-black/20 hover:bg-black/10 hover:text-black focus-visible:ring-black/20"
						/>
					</nav>
				</div>
			</header>

			{/* Hero Section — texto + preview integrado */}
			<section className="relative overflow-hidden pt-14 md:pt-20 lg:pt-24 pb-0">
				{/* Background — DotPattern fade conectando com navbar */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden">
					<DotPattern
						width={20}
						height={20}
						cx={1.25}
						cy={1.25}
						cr={1.25}
						className="text-primary/10 mask-[linear-gradient(to_bottom,black_0%,transparent_100%)]"
					/>
					<div className="absolute inset-0 bg-linear-to-b from-primary/6 to-transparent" />
				</div>

				<div className="max-w-8xl mx-auto px-4 relative">
					{/* Texto */}
					<div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-5 md:gap-6 pb-10 md:pb-14">
						<Badge variant="outline">
							<RiGithubFill className="size-4 mr-1" />
							Projeto Open Source
						</Badge>

						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
							Suas finanças,
							<span className="text-primary"> do seu jeito</span>
						</h1>

						<p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl px-4 sm:px-0">
							Gestão financeira self-hosted e open source. Lance manualmente ou
							capture notificações bancárias direto pelo{" "}
							<span className="text-foreground font-medium">
								Companion para Android
							</span>
							. Seus dados, seu servidor.
						</p>

						<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
							<Link
								href="https://github.com/felipegcoutinho/openmonetis"
								target="_blank"
								className="w-full sm:w-auto"
							>
								<Button size="lg" className="gap-2 w-full sm:w-auto">
									<RiGithubFill className="size-5" />
									Baixar no GitHub
								</Button>
							</Link>
							<Link
								href="https://github.com/felipegcoutinho/openmonetis#readme"
								target="_blank"
								className="w-full sm:w-auto"
							>
								<Button
									size="lg"
									variant="outline"
									className="w-full sm:w-auto gap-2"
								>
									Ver Documentação
								</Button>
							</Link>
						</div>
					</div>

					{/* Dashboard preview integrado ao hero */}
					<div className="mx-auto max-w-6xl">
						<div className="rounded-t-xl overflow-hidden border-x border-t bg-card">
							<div className="flex items-center gap-1.5 px-3 h-8 border-b bg-muted/50">
								<div className="size-2.5 rounded-full bg-muted-foreground/20" />
								<div className="size-2.5 rounded-full bg-muted-foreground/20" />
								<div className="size-2.5 rounded-full bg-muted-foreground/20" />
								<div className="ml-2 flex-1 max-w-52 h-4 rounded bg-muted-foreground/10" />
							</div>
							<Image
								src="/images/dashboard-preview-light.webp"
								alt="openmonetis Dashboard Preview"
								width={1920}
								height={1080}
								className="w-full h-auto dark:hidden"
								priority
							/>
							<Image
								src="/images/dashboard-preview-dark.webp"
								alt="openmonetis Dashboard Preview"
								width={1920}
								height={1080}
								className="w-full h-auto hidden dark:block"
								priority
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Metrics Bar */}
			<section className="py-8 md:py-12 border-y">
				<div className="max-w-8xl mx-auto px-4">
					<div className="mx-auto max-w-4xl">
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
							{[
								{
									icon: RiLayoutGridLine,
									value: "20+",
									label: "Widgets no dashboard",
									colorVar: "var(--data-9)",
								},
								{
									icon: RiShieldCheckLine,
									value: "100%",
									label: "Self-hosted",
									colorVar: "var(--data-1)",
								},
								{
									icon: RiStarLine,
									value: `${githubStats.stars}`,
									label: "Stars no GitHub",
									colorVar: "var(--data-4)",
								},
								{
									icon: RiGitBranchLine,
									value: `${githubStats.forks}`,
									label: "Forks no GitHub",
									colorVar: "var(--data-3)",
								},
							].map(({ icon: Icon, value, label, colorVar }) => (
								<div
									key={label}
									className="flex flex-col items-center text-center gap-1.5"
								>
									<Icon className="size-5" style={{ color: colorVar }} />
									<span className="text-2xl md:text-3xl font-bold">
										{value}
									</span>
									<span className="text-xs md:text-sm text-muted-foreground">
										{label}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Screenshots Gallery Section */}
			<section id="telas" className="py-12 md:py-24">
				<div className="max-w-8xl mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						<AnimateOnScroll>
							<div className="text-center mb-8 md:mb-12">
								<Badge variant="outline" className="mb-4">
									Conheça as telas
								</Badge>
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">
									Veja o que você pode fazer
								</h2>
								<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
									Explore as principais telas do OpenMonetis
								</p>
							</div>
						</AnimateOnScroll>

						<div className="space-y-10 md:space-y-14">
							{screenshotSections.map((section) => (
								<AnimateOnScroll key={section.title}>
									<div className="mb-3 text-center">
										<h3 className="font-semibold text-base md:text-lg">
											{section.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{section.description}
										</p>
									</div>
									<div className="rounded-lg overflow-hidden border bg-card">
										<div className="flex items-center gap-1.5 px-3 h-8 border-b bg-muted/50">
											<div className="size-2.5 rounded-full bg-muted-foreground/20" />
											<div className="size-2.5 rounded-full bg-muted-foreground/20" />
											<div className="size-2.5 rounded-full bg-muted-foreground/20" />
											<div className="ml-2 flex-1 max-w-52 h-4 rounded bg-muted-foreground/10" />
										</div>
										<Image
											src={section.lightSrc}
											alt={`Preview ${section.title}`}
											width={1920}
											height={1080}
											className="w-full h-auto dark:hidden"
										/>
										<Image
											src={section.darkSrc}
											alt={`Preview ${section.title}`}
											width={1920}
											height={1080}
											className="w-full h-auto hidden dark:block"
										/>
									</div>
								</AnimateOnScroll>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="funcionalidades" className="py-12 md:py-24">
				<div className="max-w-8xl mx-auto px-4">
					<div className="mx-auto max-w-5xl">
						<AnimateOnScroll>
							<div className="text-center mb-8 md:mb-12">
								<Badge variant="outline" className="mb-4">
									O que tem aqui
								</Badge>
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">
									Funcionalidades que importam
								</h2>
								<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
									Ferramentas simples para organizar suas contas, cartões,
									gastos e receitas
								</p>
							</div>
						</AnimateOnScroll>

						{/* Main Features - larger cards */}
						<AnimateOnScroll>
							<div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{mainFeatures.map((feature) => (
									<Card key={feature.title}>
										<CardContent className="pt-5 pb-5 md:pt-6">
											<div className="flex flex-col gap-3 md:gap-4">
												<div
													className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-lg"
													style={{
														backgroundColor: `color-mix(in oklch, ${feature.colorVar} 14%, transparent)`,
													}}
												>
													<feature.icon
														className="size-[22px] md:size-6"
														style={{ color: feature.colorVar }}
													/>
												</div>
												<div>
													<h3 className="font-semibold text-base md:text-lg mb-1.5 md:mb-2">
														{feature.title}
													</h3>
													<p className="text-sm text-muted-foreground leading-relaxed">
														{feature.description}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</AnimateOnScroll>

						{/* Extra Features - compact list */}
						<AnimateOnScroll>
							<div className="mt-8 md:mt-12">
								<h3 className="text-lg font-semibold text-center mb-4 md:mb-6 text-muted-foreground">
									E mais...
								</h3>
								<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{extraFeatures.map((feature) => (
										<div
											key={feature.title}
											className="flex items-start gap-3 rounded-lg border bg-card p-3 md:p-4"
										>
											<div
												className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
												style={{
													backgroundColor: `color-mix(in oklch, ${feature.colorVar} 14%, transparent)`,
												}}
											>
												<feature.icon
													className="size-[18px]"
													style={{ color: feature.colorVar }}
												/>
											</div>
											<div className="min-w-0">
												<h4 className="font-medium text-sm mb-0.5">
													{feature.title}
												</h4>
												<p className="text-xs text-muted-foreground leading-relaxed">
													{feature.description}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</AnimateOnScroll>
					</div>
				</div>
			</section>

			{/* Companion Section */}
			<section id="companion" className="py-12 md:py-24">
				<div className="max-w-8xl mx-auto px-4">
					<div className="mx-auto max-w-5xl">
						<AnimateOnScroll>
							<div className="grid gap-8 md:gap-12 md:grid-cols-2 items-center">
								{/* Text content */}
								<div className="order-2 md:order-1">
									<Badge variant="outline" className="mb-4">
										<RiSmartphoneLine className="size-3.5 mr-1" />
										App Android
									</Badge>
									<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">
										Capture automaticamente do seu celular
									</h2>
									<p className="text-base md:text-lg text-muted-foreground mb-6">
										O OpenMonetis Companion captura notificações de apps
										bancários e cria pré-lançamentos automaticamente para você
										revisar.
									</p>

									{/* Flow steps */}
									<div className="space-y-3 mb-6">
										{[
											{
												icon: RiNotification3Line,
												title: "Notificação bancária chega",
												subtitle: "O Companion intercepta automaticamente",
												colorVar: "var(--data-1)",
											},
											{
												icon: RiSmartphoneLine,
												title: "Dados extraídos e enviados",
												subtitle: "Valor, descrição e banco são identificados",
												colorVar: "var(--data-4)",
											},
											{
												icon: RiCheckLine,
												title: "Revise e confirme no OpenMonetis",
												subtitle:
													"Pré-lançamentos ficam na inbox para sua aprovação",
												colorVar: "var(--data-9)",
											},
										].map((step) => (
											<div key={step.title} className="flex items-start gap-3">
												<div
													className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
													style={{
														backgroundColor: `color-mix(in oklch, ${step.colorVar} 14%, transparent)`,
													}}
												>
													<step.icon
														className="size-4"
														style={{ color: step.colorVar }}
													/>
												</div>
												<div>
													<p className="text-sm font-medium">{step.title}</p>
													<p className="text-xs text-muted-foreground">
														{step.subtitle}
													</p>
												</div>
											</div>
										))}
									</div>

									{/* Supported banks */}
									<div className="mb-6">
										<p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
											Bancos suportados
										</p>
										<div className="flex flex-wrap gap-2">
											{companionBanks.map((bank) => (
												<span
													key={bank.name}
													className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 py-1 text-xs font-medium"
													style={{
														paddingLeft: bank.logo ? "4px" : "12px",
														paddingRight: "12px",
													}}
												>
													{bank.logo && (
														<Image
															src={bank.logo}
															alt={bank.name}
															width={18}
															height={18}
															className="rounded-full"
														/>
													)}
													{bank.name}
												</span>
											))}
										</div>
									</div>

									<Link
										href="https://github.com/felipegcoutinho/openmonetis-companion"
										target="_blank"
									>
										<Button variant="outline" className="gap-2">
											<RiGithubFill className="size-4" />
											Ver no GitHub
										</Button>
									</Link>
								</div>

								{/* Companion Screenshot */}
								<div className="order-1 md:order-2 flex items-center justify-center">
									<div className="w-full max-w-[220px] md:max-w-[260px]">
										<Image
											src="/images/openmonetis_companion.webp"
											alt="OpenMonetis Companion App"
											width={1080}
											height={2217}
											className="w-full h-auto rounded-2xl"
										/>
									</div>
								</div>
							</div>
						</AnimateOnScroll>
					</div>
				</div>
			</section>

			{/* Tech Stack Section */}
			<section id="stack" className="py-12 md:py-24">
				<div className="max-w-8xl mx-auto px-4">
					<div className="mx-auto max-w-5xl">
						<AnimateOnScroll>
							<div className="text-center mb-8 md:mb-12">
								<Badge variant="outline" className="mb-4">
									Stack técnica
								</Badge>
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">
									Construído com tecnologias modernas
								</h2>
								<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
									Open source, self-hosted e fácil de customizar
								</p>
							</div>
						</AnimateOnScroll>

						<AnimateOnScroll>
							<div className="grid gap-4 md:gap-6 sm:grid-cols-2">
								{stackItems.map((item) => (
									<Card key={item.title}>
										<CardContent>
											<div className="flex items-start gap-4">
												<div
													className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
													style={{
														backgroundColor: `color-mix(in oklch, ${item.colorVar} 14%, transparent)`,
													}}
												>
													<item.icon
														className="size-6"
														style={{ color: item.colorVar }}
													/>
												</div>
												<div>
													<h3 className="font-semibold text-base md:text-lg mb-1.5 md:mb-2">
														{item.title}
													</h3>
													<p className="text-sm text-muted-foreground mb-2 md:mb-3">
														{item.subtitle}
													</p>
													<p className="text-xs text-muted-foreground">
														{item.description}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</AnimateOnScroll>

						<div className="mt-6 md:mt-8 text-center">
							<p className="text-sm text-muted-foreground">
								Seus dados ficam no seu controle. Pode rodar localmente ou no
								seu próprio servidor.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How to run Section */}
			<section id="como-usar" className="py-12 md:py-24">
				<div className="max-w-8xl mx-auto px-4">
					<div className="mx-auto max-w-3xl">
						<AnimateOnScroll>
							<div className="text-center mb-8 md:mb-12">
								<Badge variant="outline" className="mb-4">
									Como usar
								</Badge>
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">
									Rode no seu computador
								</h2>
								<p className="text-base md:text-lg text-muted-foreground px-4 sm:px-0">
									Não há versão hospedada online. Você precisa rodar localmente.
								</p>
							</div>
						</AnimateOnScroll>

						<AnimateOnScroll>
							<SetupTabs />
						</AnimateOnScroll>

						<div className="mt-6 md:mt-8 text-center">
							<Link
								href="https://github.com/felipegcoutinho/openmonetis#-início-rápido"
								target="_blank"
								className="text-sm text-primary hover:underline"
							>
								Ver documentação completa →
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Who is this for Section */}
			<section className="py-12 md:py-24">
				<div className="max-w-8xl mx-auto px-4">
					<div className="mx-auto max-w-3xl">
						<AnimateOnScroll>
							<div className="text-center mb-8 md:mb-12">
								<Badge variant="outline" className="mb-4">
									Para quem é?
								</Badge>
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">
									Para quem funciona?
								</h2>
								<p className="text-base md:text-lg text-muted-foreground px-4 sm:px-0">
									O openmonetis funciona melhor se você:
								</p>
							</div>
						</AnimateOnScroll>

						<AnimateOnScroll>
							<div className="space-y-3 md:space-y-4">
								{whoIsItForItems.map((item) => (
									<Card key={item.title}>
										<CardContent>
											<div className="flex gap-3 md:gap-4">
												<div
													className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg"
													style={{
														backgroundColor: `color-mix(in oklch, ${item.colorVar} 14%, transparent)`,
													}}
												>
													<item.icon
														className="size-[18px] md:size-5"
														style={{ color: item.colorVar }}
													/>
												</div>
												<div>
													<h3 className="font-semibold mb-1">{item.title}</h3>
													<p className="text-xs sm:text-sm text-muted-foreground">
														{item.description}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</AnimateOnScroll>

						<AnimateOnScroll>
							<Alert className="mt-6 md:mt-8">
								<RiInformationLine />
								<AlertTitle>Não é para todo mundo</AlertTitle>
								<AlertDescription>
									Se você não se encaixa nisso, provavelmente vai abandonar
									depois de uma semana. Tudo certo! Existem outras ferramentas
									com sincronização automática que podem funcionar melhor pra
									você.
								</AlertDescription>
							</Alert>
						</AnimateOnScroll>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-12 md:py-24">
				<div className="max-w-8xl mx-auto px-4">
					<AnimateOnScroll>
						<div className="mx-auto max-w-3xl rounded-2xl border bg-card px-6 py-12 md:py-16 text-center">
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">
								Pronto para testar?
							</h2>
							<p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
								Clone o repositório, rode localmente e veja se faz sentido pra
								você. É open source e gratuito.
							</p>
							<div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
								<Link
									href="https://github.com/felipegcoutinho/openmonetis"
									target="_blank"
									className="w-full sm:w-auto"
								>
									<Button size="lg" className="gap-2 w-full sm:w-auto">
										<RiGithubFill className="size-[18px]" />
										Baixar Projeto
									</Button>
								</Link>
								<Link
									href="https://github.com/felipegcoutinho/openmonetis#-início-rápido"
									target="_blank"
									className="w-full sm:w-auto"
								>
									<Button
										size="lg"
										variant="outline"
										className="w-full sm:w-auto gap-2"
									>
										Como Instalar
									</Button>
								</Link>
							</div>
						</div>
					</AnimateOnScroll>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t py-8 md:py-12 mt-auto">
				<div className="max-w-8xl mx-auto px-4">
					<div className="mx-auto max-w-5xl">
						<div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
							<div className="sm:col-span-2 md:col-span-1">
								<Logo variant="compact" colorIcon />
								<p className="text-sm text-muted-foreground mt-3 md:mt-4">
									Projeto pessoal de gestão financeira. Open source e
									self-hosted.
								</p>
							</div>

							<div>
								<h3 className="font-semibold mb-3 md:mb-4">Projeto</h3>
								<ul className="space-y-2.5 md:space-y-3 text-sm text-muted-foreground">
									<li>
										<Link
											href="https://github.com/felipegcoutinho/openmonetis"
											target="_blank"
											className="hover:text-foreground transition-colors flex items-center gap-2"
										>
											<RiGithubFill className="size-4" />
											GitHub
										</Link>
									</li>
									<li>
										<Link
											href="https://github.com/felipegcoutinho/openmonetis#readme"
											target="_blank"
											className="hover:text-foreground transition-colors"
										>
											Documentação
										</Link>
									</li>
									<li>
										<Link
											href="https://github.com/felipegcoutinho/openmonetis/issues"
											target="_blank"
											className="hover:text-foreground transition-colors"
										>
											Reportar Bug
										</Link>
									</li>
								</ul>
							</div>

							<div>
								<h3 className="font-semibold mb-3 md:mb-4">Companion</h3>
								<ul className="space-y-2.5 md:space-y-3 text-sm text-muted-foreground">
									<li>
										<Link
											href="https://github.com/felipegcoutinho/openmonetis-companion"
											target="_blank"
											className="hover:text-foreground transition-colors flex items-center gap-2"
										>
											<RiGithubFill className="size-4" />
											GitHub
										</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className="border-t mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-sm text-muted-foreground">
							<p>
								© {new Date().getFullYear()} openmonetis. Projeto open source
								sob licença.
							</p>
							<div className="flex items-center gap-2">
								<RiShieldCheckLine className="size-4 text-primary" />
								<span>Seus dados, seu servidor</span>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
