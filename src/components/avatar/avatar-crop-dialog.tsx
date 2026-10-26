"use client";

import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useState } from "react";
import Cropper, { type Area, type MediaSize } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { AvatarCrop } from "@/lib/avatar";

type AvatarCropDialogProps = {
    // URL temporária (object URL) da imagem selecionada; quem cria também revoga
    imageUrl: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (crop: AvatarCrop) => void;
    isPending?: boolean;
    confirmLabel?: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

// Converte a área do cropper em um quadrado inteiro dentro da imagem
function toSquareCrop(area: Area, media: MediaSize): AvatarCrop {
    const x = Math.max(0, Math.round(area.x));
    const y = Math.max(0, Math.round(area.y));
    const size = Math.max(
        1,
        Math.min(
            Math.round(Math.min(area.width, area.height)),
            media.naturalWidth - x,
            media.naturalHeight - y,
        ),
    );
    return { x, y, size };
}

export function AvatarCropDialog({
    imageUrl,
    open,
    onOpenChange,
    onConfirm,
    isPending = false,
    confirmLabel = "Salvar foto",
}: AvatarCropDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!isPending) onOpenChange(next);
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ajustar foto de perfil</DialogTitle>
                    <DialogDescription>
                        Arraste para posicionar e use o zoom para enquadrar o
                        rosto.
                    </DialogDescription>
                </DialogHeader>

                {imageUrl && (
                    // A key reinicia posição e zoom a cada nova imagem
                    <CropEditor
                        key={imageUrl}
                        imageUrl={imageUrl}
                        onCancel={() => onOpenChange(false)}
                        onConfirm={onConfirm}
                        isPending={isPending}
                        confirmLabel={confirmLabel}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

type CropEditorProps = {
    imageUrl: string;
    onCancel: () => void;
    onConfirm: (crop: AvatarCrop) => void;
    isPending: boolean;
    confirmLabel: string;
};

function CropEditor({
    imageUrl,
    onCancel,
    onConfirm,
    isPending,
    confirmLabel,
}: CropEditorProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(MIN_ZOOM);
    const [area, setArea] = useState<Area | null>(null);
    const [media, setMedia] = useState<MediaSize | null>(null);

    const handleCropComplete = useCallback((_: Area, pixels: Area) => {
        setArea(pixels);
    }, []);

    const handleConfirm = () => {
        if (!area || !media) return;
        onConfirm(toSquareCrop(area, media));
    };

    return (
        <>
            <div className="relative h-72 w-full overflow-hidden rounded-lg bg-muted">
                <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    minZoom={MIN_ZOOM}
                    maxZoom={MAX_ZOOM}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                    onMediaLoaded={setMedia}
                />
            </div>

            <div className="flex items-center gap-3">
                <ZoomOut
                    size={16}
                    className="shrink-0 text-muted-foreground"
                    aria-hidden
                />
                <input
                    type="range"
                    min={MIN_ZOOM}
                    max={MAX_ZOOM}
                    step={0.05}
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    aria-label="Zoom da imagem"
                    disabled={isPending}
                    className="w-full accent-primary"
                />
                <ZoomIn
                    size={16}
                    className="shrink-0 text-muted-foreground"
                    aria-hidden
                />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancelar
                </Button>
                <Button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isPending || !area || !media}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        confirmLabel
                    )}
                </Button>
            </DialogFooter>
        </>
    );
}
