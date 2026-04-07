import { AnimatedThemeToggler } from "@/shared/components/animated-theme-toggler";
import { NotificationBell } from "@/shared/components/navigation/navbar/notification-bell";
import { RefreshPageButton } from "@/shared/components/refresh-page-button";
import type { DashboardNotificationsSnapshot } from "@/shared/lib/types/notifications";
import { checkForUpdate } from "@/shared/lib/version/check-update";
import { NavMenu } from "./nav-menu";
import { NavbarShell } from "./navbar-shell";
import { NavbarUser } from "./navbar-user";

type AppNavbarProps = {
	user: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
	pagadorAvatarUrl: string | null;
	preLancamentosCount?: number;
	notificationsSnapshot: DashboardNotificationsSnapshot;
};

export async function AppNavbar({
	user,
	pagadorAvatarUrl,
	preLancamentosCount = 0,
	notificationsSnapshot,
}: AppNavbarProps) {
	const updateCheck = await checkForUpdate();

	return (
		<NavbarShell logoHref="/dashboard" fixed>
			<NavMenu />
			{/* Grupo direito: fixo no extremo direito ate 930px */}
			<div className="flex flex-1 items-center justify-end gap-1 min-[931px]:flex-none min-[931px]:justify-start">
				<NotificationBell
					notifications={notificationsSnapshot.notifications}
					unreadCount={notificationsSnapshot.unreadCount}
					visibleCount={notificationsSnapshot.visibleCount}
					budgetNotifications={notificationsSnapshot.budgetNotifications}
					preLancamentosCount={preLancamentosCount}
				/>
				<RefreshPageButton variant="navbar" />
				<AnimatedThemeToggler variant="navbar" />
				<NavbarUser
					user={user}
					pagadorAvatarUrl={pagadorAvatarUrl}
					updateCheck={updateCheck}
				/>
			</div>
		</NavbarShell>
	);
}
