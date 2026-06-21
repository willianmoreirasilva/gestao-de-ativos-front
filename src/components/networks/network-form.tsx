"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertNetworkAction } from "@/actions/networks";
import { FieldError } from "../users/field-error";

// Mapeamento visual estático para os ENUMs do backend ficarem amigáveis
const NETWORK_TYPES = {
    GENERAL_DATA: "Dados Gerais (Corporativa)",
    CAMERA_VLAN: "VLAN de Câmeras (CFTV)",
    SWITCH_MGMT: "Gerenciamento de Switches",
    WIFI_MGMT: "Gerenciamento de Wi-Fi",
};

type Props = {
    network?: {
        id: string;
        networkAddress: string;
        cidr: number;
        vlanTag: number | null;
        type: "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";
    };
};


    export const NetworkForm = ({ network }: Props) => {
        const isEditMode = !!network; // 🌟 Identifica se é modo edição
    
        const [state, action, isPending] = useActionState(upsertNetworkAction, {
            error: "",
            fieldErrors: {},
        });
    
        return (
            <div className="w-full bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
                <form action={action} className="space-y-6">
                    {isEditMode && <input type="hidden" name="id" value={network.id} />}
                    
                    {/* 🌟 Envia os valores ocultos caso os inputs visíveis fiquem desativados */}
                    {isEditMode && (
                        <>
                            <input type="hidden" name="networkAddress" value={network.networkAddress} />
                            <input type="hidden" name="cidr" value={network.cidr} />
                        </>
                    )}
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Endereço de Rede */}
                        <div className="space-y-2">
                            <Label htmlFor="networkAddress" className="flex items-center gap-1">
                                Endereço de Rede (IP) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="networkAddress"
                                name="networkAddress"
                                placeholder="Ex: 192.168.10.0"
                                defaultValue={network?.networkAddress || ""}
                                required
                                disabled={isEditMode} // 🌟 Trava na edição
                                className={isEditMode ? "bg-zinc-50 text-zinc-500 cursor-not-allowed dark:bg-zinc-900" : ""}
                            />
                            <FieldError errors={state?.fieldErrors?.networkAddress} />
                        </div>
    
                        {/* Máscara CIDR */}
                        <div className="space-y-2">
                            <Label htmlFor="cidr" className="flex items-center gap-1">
                                Máscara CIDR (Prefixo) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="cidr"
                                name="cidr"
                                type="number"
                                placeholder="Ex: 24"
                                defaultValue={network?.cidr ?? ""}
                                required
                                disabled={isEditMode} // 🌟 Trava na edição
                                className={isEditMode ? "bg-zinc-50 text-zinc-500 cursor-not-allowed dark:bg-zinc-900" : ""}
                            />
                            <FieldError errors={state?.fieldErrors?.cidr} />
                        </div>
    
                        {/* Tag VLAN (Pode continuar editável se o seu back permitir) */}
                        <div className="space-y-2">
                            <Label htmlFor="vlanTag">Tag VLAN <span className="text-muted-foreground text-xs">(Opcional)</span></Label>
                            <Input
                                id="vlanTag"
                                name="vlanTag"
                                type="number"
                                placeholder="Ex: 100"
                                defaultValue={network?.vlanTag ?? ""}
                            />
                            <FieldError errors={state?.fieldErrors?.vlanTag} />
                        </div>
                        {/* Tipo de Rede (Desativado no modo edição) */}
                        <div className="space-y-2">
                            <Label htmlFor="type" className="flex items-center gap-1">
                                Tipo de Rede <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="type"
                                name="type"
                                defaultValue={network?.type || "GENERAL_DATA"}
                                disabled={isEditMode} // TRAVA AQUI: Usuário não consegue clicar ou mudar no Edit
                                className={`flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-950 ${
                                    isEditMode ? "bg-zinc-50 text-zinc-500 cursor-not-allowed dark:bg-zinc-900" : ""
                                }`}
                            >
                                {Object.entries(NETWORK_TYPES).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <FieldError errors={state?.fieldErrors?.type} />
                        </div>
                    </div>

                {state?.error && (
                    <div className="text-destructive text-sm p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900/50">
                        {state.error}
                    </div>
                )}

                <div className="flex items-center gap-3 border-t pt-4">
                    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                        {isPending
                            ? "Salvando..."
                            : network
                              ? "Salvar Alterações"
                              : "Cadastrar Rede"}
                    </Button>
                </div>
            </form>
        </div>
    );
    };
