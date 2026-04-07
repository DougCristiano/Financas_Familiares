import Image from "next/image";
import { cn } from "@/shared/utils/ui";

interface LogoProps {
	variant?: "full" | "small" | "compact";
	className?: string;
	/** Força texto e ícone em branco (para fundos escuros/primary) */
	white?: boolean;
}

const iconFilterClass = "brightness-0 saturate-0";

export function Logo({ variant = "full", className, white = false }: LogoProps) {
	const textBase = white ? "text-white/85" : "text-foreground";
	const textIN = white ? "text-white font-bold" : "text-primary font-bold";

	if (variant === "compact") {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<div className="relative size-8 shrink-0">
					<Image
						src="/images/logo_icon.png"
						alt="f{IN}anças"
						fill
						sizes="32px"
						className="object-contain"
						priority
					/>
				</div>
				<div className="hidden sm:flex items-baseline shrink-0">
					<span className={cn("text-sm font-medium tracking-wide", textBase)}>f</span>
					<span className={cn("text-sm tracking-wide", textIN)}>{'{IN}'}</span>
					<span className={cn("text-sm font-medium tracking-wide", textBase)}>anças</span>
				</div>
			</div>
		);
	}

	if (variant === "small") {
		return (
			<div className={cn("relative size-8 shrink-0", className)}>
				<Image
					src="/images/logo_icon.png"
					alt="f{IN}anças"
					fill
					sizes="32px"
					className="object-contain"
					priority
				/>
			</div>
		);
	}

	return (
		<div className={cn("flex items-center gap-2.5 py-4", className)}>
			<div className="relative size-9 shrink-0">
				<Image
					src="/images/logo_icon.png"
					alt="f{IN}anças"
					fill
					sizes="36px"
					className="object-contain"
					priority
				/>
			</div>
			<div className="flex items-baseline">
				<span className={cn("text-base font-medium tracking-wide", textBase)}>f</span>
				<span className={cn("text-base tracking-wide", textIN)}>{'{IN}'}</span>
				<span className={cn("text-base font-medium tracking-wide", textBase)}>anças</span>
			</div>
		</div>
	);
}
