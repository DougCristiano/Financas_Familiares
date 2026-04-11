"use client";

import {
	RiCheckLine,
	RiCloseCircleLine,
	RiFileCopyLine,
	RiWifiLine,
} from "@remixicon/react";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { DiagnosticsData } from "../diagnostics-queries";

function CopyButton({ value }: { value: string }) {
	const [copied, setCopied] = useState(false);

	function handleCopy() {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					onClick={handleCopy}
					className="shrink-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
					aria-label="Copiar"
				>
					{copied ? (
						<RiCheckLine className="size-3.5 text-success" />
					) : (
						<RiFileCopyLine className="size-3.5" />
					)}
				</button>
			</TooltipTrigger>
			<TooltipContent>{copied ? "Copiado!" : "Copiar"}</TooltipContent>
		</Tooltip>
	);
}

function Row({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-2">
			<span className="text-sm text-muted-foreground shrink-0">{label}</span>
			<span className="text-sm font-medium text-right flex items-center gap-1.5 min-w-0">
				{children}
			</span>
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1">
			<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
				{title}
			</p>
			<div className="divide-y">{children}</div>
		</div>
	);
}

function StatusBadge({ ok, labelOk = "Configurado", labelFail = "Não configurado" }: { ok: boolean; labelOk?: string; labelFail?: string }) {
	return ok ? (
		<Badge variant="outline" className="gap-1 text-success border-success/30 bg-success/5 font-medium">
			<RiCheckLine className="size-3" />
			{labelOk}
		</Badge>
	) : (
		<Badge variant="outline" className="gap-1 text-muted-foreground font-medium">
			<RiCloseCircleLine className="size-3" />
			{labelFail}
		</Badge>
	);
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(date));
}

export function DiagnosticsTab({ data }: { data: DiagnosticsData }) {
	return (
		<div className="space-y-6">
			<Section title="Identidade">
				<Row label="User ID">
					<span className="font-mono text-xs truncate">{data.identity.userId}</span>
					<CopyButton value={data.identity.userId} />
				</Row>
				<Row label="Nome">{data.identity.name}</Row>
				<Row label="E-mail">{data.identity.email}</Row>
			</Section>

			<Separator />

			<Section title="Sessão">
				<Row label="Criada em">{formatDate(data.session.createdAt)}</Row>
				<Row label="Expira em">{formatDate(data.session.expiresAt)}</Row>
			</Section>

			<Separator />

			<Section title="Aplicação">
				<Row label="Versão">
					<span className="font-mono">v{data.app.version}</span>
				</Row>
				<Row label="Ambiente">
					<Badge variant="outline" className="font-mono font-medium">
						{data.app.nodeEnv}
					</Badge>
				</Row>
				{data.app.buildSha && (
					<Row label="Build SHA">
						<span className="font-mono text-xs">{data.app.buildSha.slice(0, 8)}</span>
						<CopyButton value={data.app.buildSha} />
					</Row>
				)}
			</Section>

			<Separator />

			<Section title="Configuração do servidor">
				<Row label="Storage S3">
					<StatusBadge ok={data.server.s3Configured} />
				</Row>
				<Row label="E-mail (Resend)">
					<StatusBadge ok={data.server.emailConfigured} />
				</Row>
				<Row label="Domínio público">
					{data.server.publicDomain ? (
						<span className="font-mono text-xs">{data.server.publicDomain}</span>
					) : (
						<span className="text-muted-foreground text-xs">Não definido</span>
					)}
				</Row>
			</Section>

			<Separator />

			<Section title="Saúde">
				<Row label="Banco de dados">
					{data.health.db === "ok" ? (
						<Badge variant="outline" className="gap-1 text-success border-success/30 bg-success/5 font-medium">
							<RiWifiLine className="size-3" />
							Online
							{data.health.dbLatencyMs !== null && (
								<span className="text-muted-foreground font-normal">
									· {data.health.dbLatencyMs}ms
								</span>
							)}
						</Badge>
					) : (
						<Badge variant="outline" className="gap-1 text-destructive border-destructive/30 bg-destructive/5 font-medium">
							<RiCloseCircleLine className="size-3" />
							Erro
						</Badge>
					)}
				</Row>
			</Section>

			<Separator />

			<Section title="Uso">
				<Row label="Lançamentos">
					<span>{data.usage.transactions.toLocaleString("pt-BR")}</span>
				</Row>
				<Row label="Anexos">
					<span>{data.usage.attachments.toLocaleString("pt-BR")}</span>
				</Row>
				<Row label="Anotações">
					<span>{data.usage.notes.toLocaleString("pt-BR")}</span>
				</Row>
				<Row label="Itens no Inbox">
					<span>{data.usage.inboxItems.toLocaleString("pt-BR")}</span>
				</Row>
			</Section>
		</div>
	);
}
