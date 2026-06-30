"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";

import { upsertLocationAction } from "@/actions/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/users/field-error";
import { Location } from "@/types/location";

type Props = {
  location?: Location;
  onSuccess?: (newId: string) => void;
};

type ActionState = {
  error: string;
  fieldErrors: Record<string, string[]>;
  data?: Location;
};

const initialState: ActionState = {
  error: "",
  fieldErrors: {},
};

export const LocationForm = ({ location, onSuccess }: Props) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    upsertLocationAction,
    initialState,
  );

  // 🎯 Captura o sucesso da Server Action
  useEffect(() => {
    const hasId = !!state?.data?.id;
    const hasErrors =
      !!state?.error ||
      (state?.fieldErrors && Object.keys(state.fieldErrors).length > 0);

    if (hasId && !hasErrors) {
      const novoId = String(state.data!.id);

      if (onSuccess) {
        onSuccess(novoId); // Se for modal, passa o ID limpo pro Combobox
      } else {
        router.push("/infra/locations"); // Se for página cheia, redireciona
        router.refresh();
      }
    }
  }, [state, onSuccess, router]);

  // 🌟 INTERCEPTADOR CRUCIAL: Controla o envio via transição isolada do React 19
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Dispara a action de forma atômica, forçando o retorno do objeto completo
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
      {/* Trocamos action={action} pelo onSubmit controlado */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {location && <input type="hidden" name="id" value={location.id} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name" className="flex items-center gap-1">
              Nome do Local <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Laboratório de Informática, Almoxarifado"
              defaultValue={location?.name || ""}
              required
            />
            <FieldError errors={state?.fieldErrors?.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="building">
              Prédio / Bloco{" "}
              <span className="text-muted-foreground text-xs">(Opcional)</span>
            </Label>
            <Input
              id="building"
              name="building"
              placeholder="Ex: Bloco A, Prédio Central"
              defaultValue={location?.building || ""}
            />
            <FieldError errors={state?.fieldErrors?.building} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor">
              Andar{" "}
              <span className="text-muted-foreground text-xs">(Opcional)</span>
            </Label>
            <Input
              id="floor"
              name="floor"
              placeholder="Ex: 3º andar, Térreo"
              defaultValue={location?.floor || ""}
            />
            <FieldError errors={state?.fieldErrors?.floor} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">
              Sala{" "}
              <span className="text-muted-foreground text-xs">(Opcional)</span>
            </Label>
            <Input
              id="room"
              name="room"
              placeholder="Ex: Sala 302, Auditório"
              defaultValue={location?.room || ""}
            />
            <FieldError errors={state?.fieldErrors?.room} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">
              Observações{" "}
              <span className="text-muted-foreground text-xs">(Opcional)</span>
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Diretrizes de acesso, chaves ou detalhes extras sobre este local..."
              defaultValue={location?.notes || ""}
              className="min-h-[100px] resize-y"
            />
            <FieldError errors={state?.fieldErrors?.notes} />
          </div>
        </div>

        {state?.error && (
          <div className="text-destructive text-sm p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900/50">
            {state.error}
          </div>
        )}

        <div className="flex items-center gap-3 border-t pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
            onClick={(e) => {
              // 🌟 ISSO AQUI EVITA QUE O FORMULÁRIO DO COMPUTADOR SEJA ENVIADO JUNTO!
              e.stopPropagation();
            }}
          >
            {isPending
              ? "Salvando..."
              : location
                ? "Salvar Alterações"
                : "Cadastrar Local"}
          </Button>
        </div>
      </form>
    </div>
  );
};
