"use client";

import { useActionState } from "react";

import { upsertLocationAction } from "@/actions/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/users/field-error";
import { Location } from "@/types/location";

type Props = {
    location?: Location; // Se vier preenchido, o formulário entra em modo Edição automaticamente
};

type ActionState = {
    error: string;
    fieldErrors: Record<string, string[]>;
};

const initialState: ActionState = {
    error: "",
    fieldErrors: {},
};

export const LocationForm = ({ location }: Props) => {
    const [state, action, isPending] = useActionState(
        upsertLocationAction,
        initialState,
    );

    return (
        <div className="p-4 max-w-2xl bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <form action={action} className="space-y-6">
                {/* ID oculto essencial para o fluxo de Edição (Upsert) */}
                {location && (
                    <input type="hidden" name="id" value={location.id} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campo Nome: Ocupa a linha inteira (Full width no grid) */}
                    <div className="space-y-2 md:col-span-2">
                        <Label
                            htmlFor="name"
                            className="flex items-center gap-1"
                        >
                            Nome do Local{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ex: Laboratório de Informática, Almoxarifado"
                            defaultValue={location?.name || ""}
                            required
                        />
                        <FieldError errors={state?.fieldErrors?.name} />
                    </div>

                    {/* Campo Prédio/Bloco: Opcional */}
                    <div className="space-y-2">
                        <Label htmlFor="building">
                            Prédio / Bloco{" "}
                            <span className="text-muted-foreground text-xs">
                                (Opcional)
                            </span>
                        </Label>
                        <Input
                            id="building"
                            name="building"
                            placeholder="Ex: Bloco A, Prédio Central"
                            defaultValue={location?.building || ""}
                        />
                        <FieldError errors={state?.fieldErrors?.building} />
                    </div>

                    {/* Campo Andar: Opcional */}
                    <div className="space-y-2">
                        <Label htmlFor="floor">
                            Andar{" "}
                            <span className="text-muted-foreground text-xs">
                                (Opcional)
                            </span>
                        </Label>
                        <Input
                            id="floor"
                            name="floor"
                            placeholder="Ex: 3º andar, Térreo"
                            defaultValue={location?.floor || ""}
                        />
                        <FieldError errors={state?.fieldErrors?.floor} />
                    </div>

                    {/* Campo Sala: Opcional */}
                    <div className="space-y-2">
                        <Label htmlFor="room">
                            Sala{" "}
                            <span className="text-muted-foreground text-xs">
                                (Opcional)
                            </span>
                        </Label>
                        <Input
                            id="room"
                            name="room"
                            placeholder="Ex: Sala 302, Auditório"
                            defaultValue={location?.room || ""}
                        />
                        <FieldError errors={state?.fieldErrors?.room} />
                    </div>

                    {/* Campo Observações: Ocupa a linha inteira */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">
                            Observações{" "}
                            <span className="text-muted-foreground text-xs">
                                (Opcional)
                            </span>
                        </Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Diretrizes de acesso, chaves ou detalhes extras sobre este local..."
                            defaultValue={location?.notes || ""}
                            className="min-h-[100px] resize-y"
                        />
                        <FieldError errors={state?.fieldErrors?.notes} />
                    </div>
                </div>

                {/* Banner de erro geral da API */}
                {state?.error && (
                    <div className="text-destructive text-sm p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900/50">
                        {state.error}
                    </div>
                )}

                {/* Botões de Ação com feedback visual */}
                <div className="flex items-center gap-3 border-t pt-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto"
                    >
                        {isPending
                            ? "Salvando..."
                            : location
                              ? "Salvar Alterações"
                              : "Cadastrar Local"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
