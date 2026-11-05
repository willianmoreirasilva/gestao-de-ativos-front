"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

/** Campo de senha com botão para mostrar ou ocultar o texto */
function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
    const [visible, setVisible] = React.useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                type={visible ? "text" : "password"}
                disabled={disabled}
                className={cn("pr-9", className)}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                disabled={disabled}
                aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={visible}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
                {visible ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}

export { PasswordInput };
