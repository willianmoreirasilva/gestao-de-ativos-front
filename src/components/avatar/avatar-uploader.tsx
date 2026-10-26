"use client";

import { AlertCircle, Camera, Loader2, Trash2 } from "lucide-react";
import {
    type ChangeEvent,
    type ReactNode,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    AVATAR_ACCEPT_ATTR,
    type AvatarCrop,
    validateAvatarFile,
} from "@/lib/avatar";
import { cn } from "@/lib/utils";

import { AvatarCropDialog } from "./avatar-crop-dialog";
import { UserAvatar } from "./user-avatar";

type AvatarUploaderProps = {
    image: string | null;
    name: string | null;
    email: string;
    isPending?: boolean;
    // Deve resolver true quando a imagem foi aceita, para fechar o recorte
    onSelect: (file: File, crop: AvatarCrop) => Promise<boolean>;
    onRemove?: () => void;
    // "inline": foto ao lado das ações; "stacked": tudo centralizado em coluna
    layout?: "inline" | "stacked";
    // Conteúdo exibido entre a foto e as ações no layout "stacked"
    children?: ReactNode;
    // Texto do botão de confirmação do recorte
    cropConfirmLabel?: string;
    // Dica exibida abaixo dos botões
    hint?: string;
    className?: string;
};

/**
 * Seleção, validação e recorte de avatar. Não chama a API: quem usa decide
 * o que fazer com o arquivo e o recorte (salvar o perfil, anexar ao convite...).
 */
export function AvatarUploader({
    image,
    name,
    email,
    isPending = false,
    onSelect,
    onRemove,
    layout = "inline",
    children,
    cropConfirmLabel,
    hint = "JPG, PNG ou WebP de até 5 MB.",
    className,
}: AvatarUploaderProps) {
    const stacked = layout === "stacked";
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const previewRef = useRef<string | null>(null);

    // Troca a URL temporária da imagem, liberando a anterior
    const replacePreview = (next: string | null) => {
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        previewRef.current = next;
        setPreviewUrl(next);
    };

    // Libera a URL temporária ao sair da página
    useEffect(
        () => () => {
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        },
        [],
    );

    const closeCrop = () => {
        setCropOpen(false);
        setFile(null);
        replacePreview(null);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0];
        // Permite escolher o mesmo arquivo novamente
        event.target.value = "";
        if (!selected) return;

        const validationError = validateAvatarFile(selected);
        if (validationError) {
            setError(validationError);
            toast.error(validationError);
            return;
        }

        setError(null);
        setFile(selected);
        replacePreview(URL.createObjectURL(selected));
        setCropOpen(true);
    };

    const handleConfirm = async (crop: AvatarCrop) => {
        if (!file) return;
        const accepted = await onSelect(file, crop);
        if (accepted) closeCrop();
    };

    return (
        <div
            className={cn(
                stacked
                    ? "flex flex-col items-center gap-4 text-center"
                    : "flex flex-col sm:flex-row sm:items-center gap-4",
                className,
            )}
        >
            <div className="relative w-fit">
                <UserAvatar
                    image={image}
                    name={name}
                    email={email}
                    className={
                        stacked
                            ? "h-28 w-28 ring-4 ring-card shadow-md"
                            : "h-20 w-20 border border-primary/20"
                    }
                    fallbackClassName={stacked ? "text-3xl" : "text-xl"}
                />
                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                        <Loader2
                            className="h-6 w-6 animate-spin text-primary"
                            aria-label="Enviando imagem"
                        />
                    </div>
                )}
            </div>

            {stacked && children}

            <div
                className={cn(
                    "space-y-2",
                    stacked && "flex flex-col items-center",
                )}
            >
                <div
                    className={cn(
                        "flex flex-wrap gap-2",
                        stacked && "justify-center",
                    )}
                >
                    <input
                        ref={inputRef}
                        id={inputId}
                        type="file"
                        accept={AVATAR_ACCEPT_ATTR}
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={isPending}
                        tabIndex={-1}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                        disabled={isPending}
                    >
                        <Camera className="h-4 w-4" />
                        {image ? "Alterar foto" : "Adicionar foto"}
                    </Button>
                    {image && onRemove && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onRemove}
                            disabled={isPending}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                            Remover
                        </Button>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">{hint}</p>
                {error && (
                    <p
                        role="alert"
                        className="flex items-center gap-1.5 text-xs text-destructive"
                    >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {error}
                    </p>
                )}
            </div>

            <AvatarCropDialog
                imageUrl={previewUrl}
                open={cropOpen}
                onOpenChange={(open) => {
                    if (!open) closeCrop();
                }}
                onConfirm={handleConfirm}
                isPending={isPending}
                confirmLabel={cropConfirmLabel}
            />
        </div>
    );
}
