"use client";

import { ConfirmActionDialog } from "@/shared/components/confirm-action-dialog";

interface UnsavedChangesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

export function UnsavedChangesDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Descartar alterações?",
    description = "Você tem alterações não salvas. Se continuar, as mudanças serão perdidas.",
    confirmLabel = "Descartar",
    cancelLabel = "Continuar editando",
}: UnsavedChangesDialogProps) {
    return (
        <ConfirmActionDialog
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            confirmVariant="destructive"
            onConfirm={onConfirm}
        />
    );
}
