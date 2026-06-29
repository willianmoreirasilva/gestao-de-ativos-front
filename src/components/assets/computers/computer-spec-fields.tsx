"use client";

import { UseFormReturn } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateAssetInput } from "@/schemas/assets";

interface ComputerSpecFieldsProps {
  form: UseFormReturn<UpdateAssetInput>;
}

export function ComputerSpecFields({ form }: ComputerSpecFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white dark:bg-zinc-950 border rounded-xl shadow-sm">
      <div className="col-span-1 md:col-span-2">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Especificações de Hardware & Sistema</h3>
        <p className="text-xs text-zinc-500">Dados técnicos exclusivos identificadores desta máquina.</p>
      </div>

      <FormField
        control={form.control}
        name="computer.hostname"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold">Hostname (Nome da Máquina)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: CPD-COMP01" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="computer.username"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold">Usuário Principal</FormLabel>
            <FormControl>
              <Input placeholder="Ex: joao.silva" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="computer.processor"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold">Processador</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Intel Core i5-12400" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="computer.memory"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold">Memória RAM</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 16GB DDR4" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
}