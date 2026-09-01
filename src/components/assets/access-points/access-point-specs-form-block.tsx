"use client";

import {
    Eye,
    EyeOff,
    KeyRound,
    Layers,
    ShieldCheck,
    Tag,
    Wifi,
} from "lucide-react";
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AccessPointSpecsFormBlockProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    disabled?: boolean;
}

export function AccessPointSpecsFormBlock<TFieldValues extends FieldValues>({
    control,
    disabled = false,
}: AccessPointSpecsFormBlockProps<TFieldValues>) {
    const [showWifiPass, setShowWifiPass] = useState(false);
    const [showAdminPass, setShowAdminPass] = useState(false);

    return (
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <Wifi
                    className="text-emerald-600 dark:text-emerald-400"
                    size={18}
                />
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        Especificações do Access Point
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Informe os dados de identificação, Wi-Fi e credenciais
                        de gerenciamento
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome do AP */}
                <FormField
                    control={control}
                    name={"name" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Nome do Access Point{" "}
                                <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: AP-RECEPCAO-01"
                                    className="h-9 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Fabricante / Vendor */}
                <FormField
                    control={control}
                    name={"vendor" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Layers size={13} className="text-zinc-400" />{" "}
                                Fabricante (Vendor)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: Ubiquiti, Aruba, Intelbras, Mikrotik"
                                    className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Modelo */}
                <FormField
                    control={control}
                    name={"model" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Modelo do Equipamento{" "}
                                <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: UniFi AP AC Pro"
                                    className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Endereço MAC */}
                <FormField
                    control={control}
                    name={"mac" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <Tag size={13} /> Endereço MAC (Físico)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: 00:1B:44:11:33:40"
                                    className="h-9 text-xs font-mono uppercase bg-zinc-50/50 dark:bg-zinc-900/50 border-emerald-200 dark:border-emerald-900/40"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Versão de Firmware */}
                <FormField
                    control={control}
                    name={"firmwareVersion" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Versão do Firmware
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: v6.5.54"
                                    className="h-9 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* SSID */}
                <FormField
                    control={control}
                    name={"ssid" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Nome da Rede Wi-Fi (SSID)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: Empresa_Corp_5G"
                                    className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Senha do Wi-Fi */}
                <FormField
                    control={control}
                    name={"wifiPassword" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Senha do Wi-Fi
                            </FormLabel>
                            <div className="relative">
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={
                                            showWifiPass ? "text" : "password"
                                        }
                                        value={field.value || ""}
                                        disabled={disabled}
                                        placeholder="••••••••"
                                        className="h-9 text-xs font-mono pr-9 bg-zinc-50/50 dark:bg-zinc-900/50"
                                    />
                                </FormControl>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={disabled}
                                    onClick={() =>
                                        setShowWifiPass((prev) => !prev)
                                    }
                                    className="absolute right-0 top-0 h-9 w-9 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                >
                                    {showWifiPass ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}
                                </Button>
                            </div>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Tipo de Segurança */}
                <FormField
                    control={control}
                    name={"securityType" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <ShieldCheck
                                    size={13}
                                    className="text-zinc-400"
                                />{" "}
                                Tipo de Segurança
                            </FormLabel>
                            <Select
                                disabled={disabled}
                                onValueChange={field.onChange}
                                value={field.value || ""}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="OPEN">
                                        Aberta (Sem Senha)
                                    </SelectItem>
                                    <SelectItem value="WPA2_PSK">
                                        WPA2-PSK (Pessoal)
                                    </SelectItem>
                                    <SelectItem value="WPA3_PSK">
                                        WPA3-PSK (Pessoal)
                                    </SelectItem>
                                    <SelectItem value="WPA2_ENTERPRISE">
                                        WPA2 Enterprise
                                    </SelectItem>
                                    <SelectItem value="WPA3_ENTERPRISE">
                                        WPA3 Enterprise
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Banda de Frequência */}
                <FormField
                    control={control}
                    name={"frequencyBand" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Banda de Frequência
                            </FormLabel>
                            <Select
                                disabled={disabled}
                                onValueChange={field.onChange}
                                value={field.value || ""}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="BAND_2_4GHZ">
                                        2.4 GHz
                                    </SelectItem>
                                    <SelectItem value="BAND_5GHZ">
                                        5.0 GHz
                                    </SelectItem>
                                    <SelectItem value="DUAL_BAND">
                                        Dual Band (2.4 / 5.0 GHz)
                                    </SelectItem>
                                    <SelectItem value="TRI_BAND">
                                        Tri Band (2.4 / 5.0 / 6.0 GHz)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Usuário Admin */}
                <FormField
                    control={control}
                    name={"adminUsername" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <KeyRound size={13} className="text-zinc-400" />{" "}
                                Usuário do Painel
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: admin"
                                    className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Senha Admin */}
                <FormField
                    control={control}
                    name={"adminPassword" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <KeyRound size={13} className="text-zinc-400" />{" "}
                                Senha do Painel
                            </FormLabel>
                            <div className="relative">
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={
                                            showAdminPass ? "text" : "password"
                                        }
                                        value={field.value || ""}
                                        disabled={disabled}
                                        placeholder="••••••••"
                                        className="h-9 text-xs font-mono pr-9 bg-zinc-50/50 dark:bg-zinc-900/50"
                                    />
                                </FormControl>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={disabled}
                                    onClick={() =>
                                        setShowAdminPass((prev) => !prev)
                                    }
                                    className="absolute right-0 top-0 h-9 w-9 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                >
                                    {showAdminPass ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}
                                </Button>
                            </div>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Observações */}
                <FormField
                    control={control}
                    name={"notes" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Observações Gerais
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Local de instalação física, teto, parede, IP secundário..."
                                    className="text-xs min-h-20 resize-none bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
