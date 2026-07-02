"use client";

import { useFormState } from "react-dom";

import {
    createDiskAction,
    createOperatingSystemAction,
    createProcessorAction,
} from "@/actions/options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Componente Genérico para criar opções (CPU, SO, Disco)
export function QuickOptionForm({
    type,
    onSuccess,
}: {
    type: "processor" | "os" | "disk";
    onSuccess: (id: string) => void;
}) {
    const handleAction = async (formData: FormData) => {
        const name = formData.get("name") as string;
        if (!name) return;

        let result;
        if (type === "processor") result = await createProcessorAction(name);
        else if (type === "os")
            result = await createOperatingSystemAction(name);
        else result = await createDiskAction(name);

        if (result?.data?.id) onSuccess(result.data.id);
    };

    return (
        <form action={handleAction} className="flex flex-col gap-3">
            <Input
                name="name"
                placeholder="Ex: Intel Core i9, Windows 11, SSD 1TB..."
                autoFocus
            />
            <Button
                type="submit"
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
                Cadastrar e Selecionar
            </Button>
        </form>
    );
}
