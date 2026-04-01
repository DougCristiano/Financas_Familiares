export default function PageDescription({
	title,
	subtitle,
	icon,
}: {
	title?: string;
	subtitle?: string;
	icon?: React.ReactNode;
}) {
	return (
		<div>
			<h1 className="text-xl font-medium flex items-center gap-1 tracking-tight">
				<span className="text-primary">{icon}</span>
				{title}
			</h1>
			<h2 className="text-sm max-w-2xl text-muted-foreground leading-relaxed mt-1.5">
				{subtitle}
			</h2>
		</div>
	);
}
