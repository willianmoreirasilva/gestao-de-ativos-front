"use client";

import { Link2, Network, Terminal } from "lucide-react";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";

import { ComboboxSearch } from "@/components/ui/combobox-search";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/users/field-error";
import { OptionItem } from "@/types/assets";

import { NetworkSelectorFields } from "./network-selector-fields";

type VlanType = "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";

interface ConnectivityFormBlockProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    switches: OptionItem[];
    vlanType?: VlanType;
    selectedNetworkId: string;
    onNetworkChange: (id: string) => void;
    selectedIpId: string;
    onIpChange: (id: string) => void;
    isManualMode: boolean;
    setIsManualMode: (manual: boolean) => void;
    manualIpValue: string;
    onManualIpChange: (ip: string) => void;
    fieldErrors?: { [key: string]: string[] };
    disabled?: boolean;
}

export function ConnectivityFormBlock<TFieldValues extends FieldValues>({
    control,
    switches,
    vlanType = "GENERAL_DATA",
    selectedNetworkId,
    onNetworkChange,
    selectedIpId,
    onIpChange,
    isManualMode,
    setIsManualMode,
    manualIpValue,
    onManualIpChange,
    fieldErrors,
    disabled = false,
}: ConnectivityFormBlockProps<TFieldValues>) {
    const watchedSwitchId = useWatch({
        control,
        name: "switchId" as Path<TFieldValues>,
    });
    const isSwitchDisconnected = !watchedSwitchId || watchedSwitchId === "";

    return (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <Terminal className="text-emerald-500" size={18} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Conectividade IP & Rede
                </h3>
            </div>

            <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Network size={14} className="text-zinc-400" />
                    Atribuição de Endereço IPv4
                </span>

                <NetworkSelectorFields
                    vlanType={vlanType}
                    selectedNetworkId={selectedNetworkId}
                    onNetworkChange={onNetworkChange}
                    selectedIpId={selectedIpId}
                    onIpChange={onIpChange}
                    isManualMode={isManualMode}
                    setIsManualMode={setIsManualMode}
                    manualIpValue={manualIpValue}
                    onManualIpChange={onManualIpChange}
                    fieldErrors={fieldErrors}
                />
            </div>

            <div className="pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800 space-y-4">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Link2 size={14} className="text-zinc-400" />
                    Mapeamento Físico de Switch
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name={"switchId" as Path<TFieldValues>}
                        render={({ field, fieldState }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    Switch Concentrador
                                </FormLabel>
                                <ComboboxSearch
                                    options={switches}
                                    value={field.value || ""}
                                    onChange={(val) =>
                                        field.onChange(val || "")
                                    }
                                    placeholder="Pesquisar e selecionar switch..."
                                />
                                <FieldError
                                    errors={
                                        fieldState.error?.message
                                            ? [fieldState.error.message]
                                            : undefined
                                    }
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={"switchPort" as Path<TFieldValues>}
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    Porta Física do Switch
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder={
                                            isSwitchDisconnected
                                                ? "Selecione um switch antes"
                                                : "Ex: 24 ou 5"
                                        }
                                        disabled={
                                            isSwitchDisconnected || disabled
                                        }
                                        className="h-9 text-xs font-mono disabled:bg-zinc-50 dark:disabled:bg-zinc-900/50 disabled:text-zinc-400 dark:disabled:text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/50 transition-colors"
                                    />
                                </FormControl>
                                <FieldError
                                    errors={
                                        fieldState.error?.message
                                            ? [fieldState.error.message]
                                            : undefined
                                    }
                                />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
