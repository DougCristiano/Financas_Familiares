import {
	RiBankCardLine,
	RiBarChart2Line,
	RiShieldCheckLine,
} from "@remixicon/react";
import Image from "next/image";
import { DotPattern } from "@/shared/components/ui/dot-pattern";
import { AuthSidebarInvoicesMock } from "./auth-sidebar-invoices-mock";

function FeatureItem({
	icon: Icon,
	text,
}: {
	icon: React.ComponentType<{ className?: string }>;
	text: string;
}) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/12">
				<Icon className="h-3.5 w-3.5 text-white/70" />
			</div>
			<span className="text-sm font-medium text-white/80">{text}</span>
		</div>
	);
}

function AuthSidebar() {
	return (
		<div className="relative hidden flex-col overflow-hidden bg-primary md:flex">
			<div className="pointer-events-none absolute inset-0">
				<DotPattern
					width={18}
					height={18}
					cx={1.15}
					cy={1.15}
					cr={1.15}
					className="text-black/10 mask-[radial-gradient(circle_at_top_left,black,transparent_80%)]"
				/>
				<div className="absolute inset-0 bg-linear-to-br from-white/9 via-transparent to-black/7" />
			</div>

			<div className="relative flex flex-1 flex-col justify-between p-10 lg:p-12">
				<div className="flex items-center gap-3">
					<div className="relative size-10 shrink-0">
						<Image
							src="/images/logo_icon.png"
							alt="Dinheir{IN}"
							fill
							sizes="40px"
							className="object-contain brightness-0 invert"
							priority
						/>
					</div>
					<div className="flex items-baseline">
						<span className="text-lg font-medium tracking-wide text-white">
							Dinheir
						</span>
						<span className="text-lg tracking-wide text-white font-bold">
							{"{IN}"}
						</span>
					</div>
				</div>

				<div className="flex flex-1 items-center justify-center py-10">
					<div className="w-full rotate-[1.5deg]">
						<AuthSidebarInvoicesMock />
					</div>
				</div>

				<div className="space-y-3">
					<FeatureItem
						icon={RiBarChart2Line}
						text="Controle de gastos por categoria"
					/>
					<FeatureItem
						icon={RiBankCardLine}
						text="Faturas e cartões centralizados"
					/>
					<FeatureItem
						icon={RiShieldCheckLine}
						text="Seus dados, sem rastreamento"
					/>
				</div>
			</div>
		</div>
	);
}

export default AuthSidebar;
