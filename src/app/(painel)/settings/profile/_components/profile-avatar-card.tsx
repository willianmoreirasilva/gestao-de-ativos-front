"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";

import { removeMyAvatarAction, updateMyAvatarAction } from "@/actions/users";
import { AvatarUploader } from "@/components/avatar/avatar-uploader";
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";
import { authClient } from "@/lib/auth-client";
import { type AvatarCrop, buildAvatarFormData } from "@/lib/avatar";

type Props = {
    image: string | null;
    name: string | null;
    email: string;
    // Dados do perfil exibidos entre a foto e as ações
    children?: ReactNode;
};

// Liga o seletor de avatar às actions do próprio perfil
export function ProfileAvatarCard({ image, name, email, children }: Props) {
    const router = useRouter();
    const { refetch } = authClient.useSession();
    const [currentImage, setCurrentImage] = useState(image);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [removeError, setRemoveError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Atualiza o sidebar e o restante da página após a confirmação do backend
    const syncInterface = async (nextImage: string | null) => {
        setCurrentImage(nextImage);
        await refetch();
        router.refresh();
    };

    const handleSelect = (file: File, crop: AvatarCrop) =>
        new Promise<boolean>((resolve) => {
            startTransition(async () => {
                const result = await updateMyAvatarAction(
                    buildAvatarFormData(file, crop),
                );
                if (!result.success) {
                    toast.error(result.error);
                    resolve(false);
                    return;
                }
                toast.success(result.message);
                await syncInterface(result.image);
                resolve(true);
            });
        });

    const handleRemove = () => {
        setRemoveError(null);
        startTransition(async () => {
            const result = await removeMyAvatarAction();
            if (!result.success) {
                setRemoveError(result.error);
                toast.error(result.error);
                return;
            }
            toast.success(result.message);
            setConfirmOpen(false);
            await syncInterface(null);
        });
    };

    return (
        <>
            <AvatarUploader
                image={currentImage}
                name={name}
                email={email}
                isPending={isPending}
                onSelect={handleSelect}
                onRemove={() => {
                    setRemoveError(null);
                    setConfirmOpen(true);
                }}
                layout="stacked"
            >
                {children}
            </AvatarUploader>
            <ConfirmDeleteDialog
                name="sua foto de perfil"
                onConfirm={handleRemove}
                open={confirmOpen}
                setOpen={setConfirmOpen}
                isDeleting={isPending}
                error={removeError}
                trigger={null}
                title="Remover foto de perfil?"
                description={() =>
                    "A foto será excluída e o avatar voltará a exibir as suas iniciais."
                }
                confirmLabel="Remover foto"
                pendingLabel="Removendo..."
            />
        </>
    );
}
