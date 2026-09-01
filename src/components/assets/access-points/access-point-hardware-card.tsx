"use client";

import {
    Check,
    Copy,
    Edit2,
    Eye,
    EyeOff,
    Key,
    Layers,
    Loader2,
    Lock,
    Radio,
    Save,
    Shield,
    Tag,
    User,
    Wifi,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { updateAccessPointAction } from "@/actions/access-points";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AccessPointHardwareCardProps {
    assetId: string;
    apData: {
        id?: string;
        name?: string | null;
        vendor?: string | null;
        model?: string | null;
        mac?: string | null;
        ssid?: string | null;
        wifiPassword?: string | null;
        securityType?: string | null;
        frequencyBand?: string | null;
        adminUsername?: string | null;
        adminPassword?: string | null;
        firmwareVersion?: string | null;
        notes?: string | null;
    };
}

export function AccessPointHardwareCard({
    assetId,
    apData,
}: AccessPointHardwareCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedMac, setCopiedMac] = useState(false);

    // Toggle de visibilidade de senhas
    const [showWifiPassword, setShowWifiPassword] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);

    // Estados do Formulário
    const [name, setName] = useState(apData.name || "");
    const [vendor, setVendor] = useState(apData.vendor || "");
    const [model, setModel] = useState(apData.model || "");
    const [mac, setMac] = useState(apData.mac || "");
    const [ssid, setSsid] = useState(apData.ssid || "");
    const [wifiPassword, setWifiPassword] = useState(apData.wifiPassword || "");
    const [securityType, setSecurityType] = useState(apData.securityType || "");
    const [frequencyBand, setFrequencyBand] = useState(
        apData.frequencyBand || "",
    );
    const [adminUsername, setAdminUsername] = useState(
        apData.adminUsername || "",
    );
    const [adminPassword, setAdminPassword] = useState(
        apData.adminPassword || "",
    );
    const [firmwareVersion, setFirmwareVersion] = useState(
        apData.firmwareVersion || "",
    );
    const [notes, setNotes] = useState(apData.notes || "");

    const handleCopyMac = (macAddress: string) => {
        if (!macAddress) return;
        navigator.clipboard.writeText(macAddress);
        setCopiedMac(true);
        toast.success(`MAC ${macAddress} copiado!`, {
            position: "bottom-right",
        });
        setTimeout(() => setCopiedMac(false), 2000);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await updateAccessPointAction(assetId, {
                name,
                vendor,
                model,
                mac,
                ssid,
                wifiPassword,
                securityType,
                frequencyBand,
                adminUsername,
                adminPassword,
                firmwareVersion,
                notes,
            });

            if (res.success) {
                toast.success("Especificações do Access Point atualizadas!");
                setIsEditing(false);
            } else {
                toast.error(res.error || "Erro ao salvar alterações.");
            }
        } catch {
            toast.error("Erro inesperado ao atualizar o Access Point.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-5">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                    <Wifi
                        className="text-cyan-600 dark:text-cyan-400 shrink-0"
                        size={18}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        Especificações do Access Point
                    </h3>
                </div>

                {!isEditing ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="h-7 text-xs gap-1.5 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                        <Edit2 size={12} /> Editar
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                            className="h-7 text-xs"
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="h-7 text-xs bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 gap-1.5"
                        >
                            {isLoading ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                <Save size={12} />
                            )}
                            Salvar
                        </Button>
                    </div>
                )}
            </div>

            {/* Modo Leitura / Edição */}
            {!isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400">
                                Nome / Identificador do AP
                            </span>
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                                {apData.name || "Não informado"}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                <Layers size={11} className="text-zinc-400" />{" "}
                                Fabricante (Vendor)
                            </span>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {apData.vendor || "N/A"}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400">
                                Modelo do Equipamento
                            </span>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {apData.model || "N/A"}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                <Radio size={11} className="text-zinc-400" />{" "}
                                Frequência / Firmware
                            </span>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {apData.frequencyBand || "N/A"}{" "}
                                {apData.firmwareVersion
                                    ? `(${apData.firmwareVersion})`
                                    : ""}
                            </span>
                        </div>
                    </div>

                    {/* Dados de Conexão Sem Fio (SSID / Senha) */}
                    <div className="p-3.5 rounded-lg bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <span className="text-[11px] font-semibold text-cyan-800 dark:text-cyan-300 block">
                                SSID Transmitido
                            </span>
                            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                {apData.ssid || "Não configurado"}
                            </span>
                        </div>

                        <div>
                            <span className="text-[11px] font-semibold text-cyan-800 dark:text-cyan-300 flex items-center gap-1">
                                <Lock size={11} /> Senha Wi-Fi / Segurança
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-mono text-zinc-800 dark:text-zinc-200">
                                    {showWifiPassword
                                        ? apData.wifiPassword || "Sem senha"
                                        : "••••••••••••"}
                                </span>
                                {apData.wifiPassword && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowWifiPassword(
                                                !showWifiPassword,
                                            )
                                        }
                                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                    >
                                        {showWifiPassword ? (
                                            <EyeOff size={12} />
                                        ) : (
                                            <Eye size={12} />
                                        )}
                                    </button>
                                )}
                                {apData.securityType && (
                                    <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-cyan-200/50 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 rounded">
                                        {apData.securityType}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Credenciais de Acesso Administrativo */}
                    <div className="p-3.5 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                <User size={11} /> Usuário Admin
                            </span>
                            <span className="text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                                {apData.adminUsername || "admin"}
                            </span>
                        </div>

                        <div>
                            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                <Key size={11} /> Senha Admin
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-mono text-zinc-800 dark:text-zinc-200">
                                    {showAdminPassword
                                        ? apData.adminPassword ||
                                          "Não informada"
                                        : "••••••••••••"}
                                </span>
                                {apData.adminPassword && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowAdminPassword(
                                                !showAdminPassword,
                                            )
                                        }
                                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                    >
                                        {showAdminPassword ? (
                                            <EyeOff size={12} />
                                        ) : (
                                            <Eye size={12} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Endereço MAC */}
                    <div className="p-3.5 rounded-lg bg-cyan-950/10 dark:bg-cyan-950/30 border border-cyan-200/50 dark:border-cyan-800/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-md bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300">
                                <Tag size={16} />
                            </div>
                            <div>
                                <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 block">
                                    Endereço MAC Físico
                                </span>
                                <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                    {apData.mac ||
                                        "Sem endereço MAC registrado"}
                                </span>
                            </div>
                        </div>

                        {apData.mac && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyMac(apData.mac!)}
                                className="h-8 text-xs gap-1.5 border-cyan-200 dark:border-cyan-800 bg-white dark:bg-zinc-900 hover:bg-cyan-50 dark:hover:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 font-semibold transition-colors"
                            >
                                {copiedMac ? (
                                    <Check
                                        size={13}
                                        className="text-cyan-500"
                                    />
                                ) : (
                                    <Copy size={13} />
                                )}
                                {copiedMac ? "Copiado!" : "Copiar MAC"}
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                /* Formulário de Edição */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Nome do AP
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: AP-RECEPCAO-01"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Fabricante (Vendor)
                        </label>
                        <Input
                            value={vendor}
                            onChange={(e) => setVendor(e.target.value)}
                            placeholder="Ex: Ruckus, Ubiquiti, Aruba, TP-Link"
                            className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Modelo do Equipamento
                        </label>
                        <Input
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="Ex: ZoneFlex R510, U6-Lite"
                            className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Frequência (Bandas)
                        </label>
                        <Input
                            value={frequencyBand}
                            onChange={(e) => setFrequencyBand(e.target.value)}
                            placeholder="Ex: Dual-Band (2.4GHz / 5GHz)"
                            className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            SSID da Rede Sem Fio
                        </label>
                        <Input
                            value={ssid}
                            onChange={(e) => setSsid(e.target.value)}
                            placeholder="Ex: Wi-Fi Corporativo"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Senha do Wi-Fi
                        </label>
                        <Input
                            type="text"
                            value={wifiPassword}
                            onChange={(e) => setWifiPassword(e.target.value)}
                            placeholder="Ex: Senha1234"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                            <Shield size={12} /> Tipo de Segurança
                        </label>
                        <Input
                            value={securityType}
                            onChange={(e) => setSecurityType(e.target.value)}
                            placeholder="Ex: WPA2-PSK / WPA3-Enterprise"
                            className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Versão do Firmware
                        </label>
                        <Input
                            value={firmwareVersion}
                            onChange={(e) => setFirmwareVersion(e.target.value)}
                            placeholder="Ex: v200.12.10.0"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Usuário Admin
                        </label>
                        <Input
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            placeholder="Ex: admin"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Senha Admin
                        </label>
                        <Input
                            type="text"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="Ex: PassAdmin#123"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                            <Tag size={12} /> Endereço MAC (Físico)
                        </label>
                        <Input
                            value={mac}
                            onChange={(e) => setMac(e.target.value)}
                            placeholder="Ex: 00:1B:44:11:33:40"
                            className="h-9 text-xs font-mono uppercase bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>
                </div>
            )}

            {/* Observações */}
            <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Notas & Observações
                </label>
                {isEditing ? (
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Adicione observações sobre cobertura de sinal, PoE, canal fixo..."
                        className="text-xs min-h-20 resize-none bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    />
                ) : (
                    <div className="p-3.5 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg border border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {apData.notes || "Nenhuma observação registrada."}
                    </div>
                )}
            </div>
        </div>
    );
}
