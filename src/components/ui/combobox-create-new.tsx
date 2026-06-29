"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxCreateNewProps {
  options: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  createLabel: string;
  modalTitle: string;
  modalDescription: string;
  createForm: (onSuccess: (newId: string) => void) => React.ReactNode;
}

export function ComboboxCreateNew({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum resultado encontrado.",
  createLabel,
  modalTitle,
  modalDescription,
  createForm,
}: ComboboxCreateNewProps) {
  const [openPopover, setOpenPopover] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const selectedOption = options.find((opt) => opt.id === value);

  // Callback acionado quando o formulário dentro do modal salvar com sucesso
  const handleCreationSuccess = (newId: string) => {
    onChange(newId); // Seleciona o recém criado
    setOpenModal(false); // Fecha o modal de criação
    setOpenPopover(false); // Fecha o popover do combo
  };

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openPopover}
            className="w-full justify-between font-normal text-sm h-10 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-foreground"
          >
            {selectedOption ? selectedOption.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 popover-content-width-same-as-trigger" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList className="max-h-[220px] overflow-y-auto">
              <CommandEmpty className="p-2 text-xs text-zinc-500">
                <p className="mb-2 text-center">{emptyMessage}</p>
              </CommandEmpty>
              
              {/* Botão estático fixado no topo para Criar Novo */}
              <div className="p-1 border-b border-zinc-100 dark:border-zinc-900">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1.5 px-2 h-8"
                  onClick={() => setOpenModal(true)}
                >
                  <Plus size={14} />
                  {createLabel}
                </Button>
              </div>

              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    value={opt.name}
                    onSelect={() => {
                      onChange(opt.id === value ? "" : opt.id);
                      setOpenPopover(false);
                    }}
                    className="text-sm py-2"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-emerald-600",
                        value === opt.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Modal Dinâmico de Criação Rápida */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">{modalTitle}</DialogTitle>
            <DialogDescription className="text-xs">{modalDescription}</DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            {createForm(handleCreationSuccess)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}