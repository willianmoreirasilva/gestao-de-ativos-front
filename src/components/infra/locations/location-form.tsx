"use client";

import { AlertCircle, Loader2, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";

import { upsertLocationAction } from "@/actions/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/users/field-error";
import { Location } from "@/types/location";

type Props = {
    location?: Location;
    onSuccess?: (newId: string) => void;
    onCancel?: () => void;
};

type ActionState = {
    error: string;
    fieldErrors: Record<string, string[]>;
    data?: Location;
};

const initialState: ActionState = {
    error: "",
    fieldErrors: {},
};

export const LocationForm = ({ location, onSuccess, onCancel }: Props) => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(
        upsertLocationAction,
        initialState,
    );

    const isEditing = !!location;

    useEffect(() => {
        const hasId = !!state?.data?.id;
        const hasErrors =
            !!state?.error ||
            (state?.fieldErrors && Object.keys(state.fieldErrors).length > 0);

        if (hasId && !hasErrors) {
            const newId = String(state.data!.id);

            if (onSuccess) {
                onSuccess(newId);
            } else {
                router.push("/infra/locations");
                router.refresh();
            }
        }
    }, [state, onSuccess, router]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <div className="w-full bg-card text-card-foreground rounded-xl border border-border/60 shadow-sm p-6 sm:p-8 transition-all">
            <form onSubmit={handleSubmit} className="space-y-6">
                {location && (
                    <input type="hidden" name="id" value={location.id} />
                )}

                <div className="space-y-4">
                    {/* Nome do Local */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-sm font-medium flex items-center gap-1"
                        >
                            Nome do Local / Sala{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ex: Laboratório de Informática 01, Auditório Principal"
                            defaultValue={location?.name || ""}
                            disabled={isPending}
                            autoFocus
                            className={
                                state?.fieldErrors?.name
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : ""
                            }
                        />
                        <FieldError errors={state?.fieldErrors?.name} />
                    </div>

                    {/* Bloco / Andar / Sala agrupados */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="building"
                                className="text-sm font-medium"
                            >
                                Prédio / Bloco
                            </Label>
                            <Input
                                id="building"
                                name="building"
                                placeholder="Ex: Bloco A"
                                defaultValue={location?.building || ""}
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="floor"
                                className="text-sm font-medium"
                            >
                                Andar
                            </Label>
                            <Input
                                id="floor"
                                name="floor"
                                placeholder="Ex: 2"
                                defaultValue={location?.floor || ""}
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="room"
                                className="text-sm font-medium"
                            >
                                Nº da Sala
                            </Label>
                            <Input
                                id="room"
                                name="room"
                                placeholder="Ex: 204"
                                defaultValue={location?.room || ""}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {/* Observações / Notas */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-medium">
                            Observações
                        </Label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            placeholder="Informações adicionais como chave de acesso, pontos de referência..."
                            defaultValue={location?.notes || ""}
                            disabled={isPending}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Banner de Erro Global */}
                {state?.error && (
                    <div className="flex items-start gap-3 text-destructive text-sm p-3.5 bg-destructive/10 rounded-lg border border-destructive/20 animate-in fade-in-50 duration-200">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{state.error}</span>
                    </div>
                )}

                {/* Ações / Rodapé */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto min-w-35 gap-2 shadow-xs"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Salvando...</span>
                            </>
                        ) : isEditing ? (
                            <>
                                <Save className="h-4 w-4" />
                                <span>Salvar Alterações</span>
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                <span>Cadastrar</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};
