import { count, eq } from "drizzle-orm";
import {
	attachments,
	inboxItems,
	notes,
	transactions,
} from "@/db/schema";
import { db } from "@/shared/lib/db";

export type DiagnosticsData = {
	identity: {
		userId: string;
		name: string;
		email: string;
	};
	session: {
		createdAt: Date;
		expiresAt: Date;
	};
	app: {
		version: string;
		nodeEnv: string;
		buildSha: string | null;
	};
	server: {
		s3Configured: boolean;
		emailConfigured: boolean;
		publicDomain: string | null;
	};
	health: {
		db: "ok" | "error";
		dbLatencyMs: number | null;
	};
	usage: {
		transactions: number;
		attachments: number;
		notes: number;
		inboxItems: number;
	};
};

export async function fetchDiagnosticsData(
	userId: string,
	user: { id: string; name: string; email: string },
	session: { createdAt: Date; expiresAt: Date },
): Promise<DiagnosticsData> {
	const dbStart = Date.now();
	let dbStatus: "ok" | "error" = "ok";
	let dbLatencyMs: number | null = null;

	try {
		await db.execute("SELECT 1");
		dbLatencyMs = Date.now() - dbStart;
	} catch {
		dbStatus = "error";
	}

	const [txCount, attachCount, notesCount, inboxCount] = await Promise.all([
		db.select({ value: count() }).from(transactions).where(eq(transactions.userId, userId)),
		db.select({ value: count() }).from(attachments).where(eq(attachments.userId, userId)),
		db.select({ value: count() }).from(notes).where(eq(notes.userId, userId)),
		db.select({ value: count() }).from(inboxItems).where(eq(inboxItems.userId, userId)),
	]);

	return {
		identity: {
			userId: user.id,
			name: user.name,
			email: user.email,
		},
		session: {
			createdAt: session.createdAt,
			expiresAt: session.expiresAt,
		},
		app: {
			version: process.env.npm_package_version ?? "—",
			nodeEnv: process.env.NODE_ENV ?? "—",
			buildSha: process.env.BUILD_SHA ?? null,
		},
		server: {
			s3Configured: !!(process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID),
			emailConfigured: !!process.env.RESEND_FROM_EMAIL,
			publicDomain: process.env.PUBLIC_DOMAIN ?? null,
		},
		health: {
			db: dbStatus,
			dbLatencyMs,
		},
		usage: {
			transactions: txCount[0]?.value ?? 0,
			attachments: attachCount[0]?.value ?? 0,
			notes: notesCount[0]?.value ?? 0,
			inboxItems: inboxCount[0]?.value ?? 0,
		},
	};
}
