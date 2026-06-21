import { networkService } from "@/services/network";
import { NetworkItem } from "@/components/networks/network-item";
import { NetworkFilters } from "@/components/networks/network-filters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/users/page-title";
import { Plus } from "lucide-react";
import Link from "next/link";

// Tipagem obrigatória do Next.js para capturar parâmetros de URL em Server Components
type PageProps = {
    searchParams: Promise<{
        search?: string;
        vlanTag?: string;
        type?: string;
    }>;
};

export default async function NetworksPage({ searchParams }: PageProps) {
    // Aguarda a resolução dos parâmetros vindos da URL do cliente
    const params = await searchParams;

    // Repassa os filtros direto para a chamada da nossa API construída no service
    const { data: networks, error } = await networkService.getNetworks({
        search: params.search,
        vlanTag: params.vlanTag,
        type: params.type,
    });

    return (
        <div className="space-y-6">
            <PageTitle
                title="Redes de Infraestrutura"
                rightSide={
                    <Link href="/infra/networks/add">
                        <Button className="flex items-center gap-2">
                            <Plus size={16} />
                            Nova Rede
                        </Button>
                    </Link>
                }
            />

            {/* 🌟 Injeção da Barra de Filtros Combinada */}
            <NetworkFilters />

            <div className="rounded-md border bg-white dark:bg-zinc-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rede / CIDR</TableHead>
                            <TableHead>VLAN</TableHead>
                            <TableHead>Tipo de Rede</TableHead>
                            <TableHead className="hidden sm:table-cell">IPs Alocados</TableHead>
                            <TableHead className="hidden sm:table-cell">IPs Disponíveis</TableHead>
                            <TableHead className="w-24">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {error && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={5} className="text-center py-10 text-destructive font-medium">
                                    {error}
                                </TableCell>
                            </TableRow>
                        )}

                        {!error && networks.length === 0 && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={5} className="text-center py-16">
                                    <p className="text-zinc-400">Nenhuma rede encontrada com os filtros aplicados.</p>
                                </TableCell>
                            </TableRow>
                        )}

                        {!error && networks.map((network) => (
                            <NetworkItem key={network.id} network={network} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}