import { notFound } from "next/navigation";

import { ComputerEditForm } from "@/components/assets/computers/computer-edit-form";
// Supondo que você use funções em services para buscar dados brutos da API
import { getAssetById } from "@/services/assets";
import { departmentService } from "@/services/department";
import { locationService } from "@/services/location";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditComputerPage({ params }: PageProps) {
  const { id } = await params;

  // Busca concorrente paralela para otimizar tempo de carregamento no servidor
  const [assetData, departments, locations] = await Promise.all([
    getAssetById(id),
    departmentService.getDepartments(),
    locationService.getLocations(),
  ]);

  if (!assetData) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Editar Computador
        </h1>
        <p className="text-sm text-zinc-500">
          Modifique as configurações patrimoniais e técnicas do ativo.
        </p>
      </div>

      <ComputerEditForm
        assetId={id}
        initialData={assetData}
        departments={departments}
        locations={locations}
      />
    </div>
  );
}
