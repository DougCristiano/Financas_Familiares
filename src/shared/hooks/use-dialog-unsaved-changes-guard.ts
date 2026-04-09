import { useCallback, useState } from "react";

interface UseDialogUnsavedChangesGuardOptions {
    hasUnsavedChanges: boolean;
    isCloseBlocked?: boolean;
    setDialogOpen: (open: boolean) => void;
}

export function useDialogUnsavedChangesGuard({
    hasUnsavedChanges,
    isCloseBlocked = false,
    setDialogOpen,
}: UseDialogUnsavedChangesGuardOptions) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const closeWithoutConfirmation = useCallback(() => {
        setConfirmOpen(false);
        setDialogOpen(false);
    }, [setDialogOpen]);

    const requestClose = useCallback(() => {
        if (isCloseBlocked) {
            return;
        }

        if (hasUnsavedChanges) {
            setConfirmOpen(true);
            return;
        }

        closeWithoutConfirmation();
    }, [closeWithoutConfirmation, hasUnsavedChanges, isCloseBlocked]);

    const handleDialogOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (nextOpen) {
                setDialogOpen(true);
                return;
            }

            requestClose();
        },
        [requestClose, setDialogOpen],
    );

    return {
        confirmOpen,
        setConfirmOpen,
        requestClose,
        handleDialogOpenChange,
        closeWithoutConfirmation,
    };
}
