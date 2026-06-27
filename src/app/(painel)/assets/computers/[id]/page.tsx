import {
    Cpu,
    HardDrive,
    Layout,
    Monitor,
    ShieldAlert,
    Terminal,
    User,
} from "lucide-react";

import { ComputerActions } from "@/components/assets/computers/computer-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { getAssetById } from "@/services/assets";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ComputerDetailsPage({ params }: Props) {
    const { id } = await params;
    const { data: asset, error } = await getAssetById(id);

    if (error || !asset) {
        return (
            <div className="space-y-6">
                <PageTitle title="Ficha Técnica" leftSide={<BackButton />} />
                <div className="p-6 text-center text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-xl flex items-center justify-center gap-2">
                    <ShieldAlert size={18} /> {error || "Ativo não encontrado."}
                </div>
            </div>
        );
    }

    const computerName = asset.computer?.hostname || "Sem Hostname";

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-2">
            {/* Título com Ações de gerenciamento */}
            <PageTitle
                title={`Ficha: ${computerName}`}
                leftSide={<BackButton />}
                rightSide={
                    <ComputerActions
                        assetId={asset.id}
                        identifier={
                            asset.computer?.hostname ||
                            asset.patrimony ||
                            "Este computador"
                        }
                    />
                }
            />

            {/* Grid Principal de Informações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* CARD 1: IDENTIFICAÇÃO GERAL */}
                <Card className="md:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-4">
                        <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                            <Monitor size={16} className="text-blue-500" />{" "}
                            Especificações do Sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                Sistema Operacional
                            </span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {asset.computer?.os || "Não Informado"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                Hostname Interno
                            </span>
                            <span className="font-mono font-medium text-sm text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 px-2 py-0.5 rounded w-fit block">
                                {asset.computer?.hostname || "N/A"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                Processador (CPU)
                            </span>
                            <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                                <Cpu size={14} className="text-zinc-400" />
                                <span>
                                    {asset.computer?.processor || "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                Memória RAM Instalada
                            </span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {asset.computer?.memory || "N/A"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                Armazenamento (Disco)
                            </span>
                            <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                                <HardDrive
                                    size={14}
                                    className="text-zinc-400"
                                />
                                <span>{asset.computer?.disk || "N/A"}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                Endereço MAC físico
                            </span>
                            <span className="font-mono text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {asset.computer?.mac || "—"}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* CARD 2: REDE E IP */}
                <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-4">
                        <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                            <Terminal size={16} className="text-emerald-500" />{" "}
                            Conectividade IP
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-5">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                Endereço IPv4 Atribuído
                            </span>
                            {asset.ip?.address ? (
                                <Badge className="text-sm font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-none px-3 py-0.5">
                                    {asset.ip.address}
                                </Badge>
                            ) : (
                                <Badge
                                    variant="destructive"
                                    className="text-xs font-semibold"
                                >
                                    Sem Endereço IP
                                </Badge>
                            )}
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                Patrimônio Corporativo
                            </span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase">
                                {asset.patrimony || "Sem Etiqueta"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                ID Único do Ativo (UUID)
                            </span>
                            <span className="text-[11px] font-mono text-zinc-400 break-all block">
                                {asset.id}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* CARD 3: RESPONSABILIDADE / SETOR */}
                <Card className="md:col-span-3 shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-4">
                        <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                            <Layout size={16} className="text-purple-500" />{" "}
                            Alocação de Infraestrutura e Responsabilidade
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Coluna 1: Usuário Responsável */}
                        <div className="space-y-1 flex items-start gap-2.5">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg mt-1">
                                <User size={16} className="text-zinc-500" />
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">
                                    Usuário de Domínio / Local
                                </span>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mt-0.5">
                                    {asset.computer?.username ||
                                        "Utilizador Padrão"}
                                </span>
                            </div>
                        </div>

                        {/* Coluna 2: Departamento */}
                        <div className="space-y-1 flex items-start gap-2.5">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg mt-1">
                                <Building2
                                    size={16}
                                    className="text-zinc-500"
                                />{" "}
                                {/* Certifique-se de importar o Building2 do lucide-react */}
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">
                                    Departamento / Setor
                                </span>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mt-0.5 text-base">
                                    {asset.department?.name || "Não Vinculado"}
                                </span>
                            </div>
                        </div>

                        {/* Coluna 3: Localização Física Detalhada */}
                        <div className="space-y-1 flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-900 pt-4 md:pt-0 md:pl-6">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg mt-1">
                                <MapPin size={16} className="text-zinc-500" />{" "}
                                {/* Importe o MapPin do lucide-react */}
                            </div>
                            <div className="space-y-2 flex-1">
                                <div>
                                    <span className="text-xs text-muted-foreground block">
                                        Localidade Principal
                                    </span>
                                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-base block">
                                        {asset.location?.name || "Não Alocado"}
                                    </span>
                                </div>

                                {/* 🌟 RENDERIZAÇÃO CONDICIONAL COMPLETA: Só exibe o grid de sub-detalhes se houver pelo menos um dado */}
                                {(asset.location?.building ||
                                    asset.location?.floor ||
                                    asset.location?.room) && (
                                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                                        {asset.location.building && (
                                            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-1.5 rounded text-center">
                                                <span className="text-[10px] text-muted-foreground block uppercase font-medium">
                                                    Prédio
                                                </span>
                                                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                    {asset.location.building}
                                                </span>
                                            </div>
                                        )}
                                        {asset.location.floor && (
                                            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-1.5 rounded text-center">
                                                <span className="text-[10px] text-muted-foreground block uppercase font-medium">
                                                    Andar
                                                </span>
                                                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                    {asset.location.floor}º
                                                </span>
                                            </div>
                                        )}
                                        {asset.location.room && (
                                            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-1.5 rounded text-center">
                                                <span className="text-[10px] text-muted-foreground block uppercase font-medium">
                                                    Sala
                                                </span>
                                                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                    {asset.location.room}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
