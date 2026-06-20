"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Location } from "@/types/location";
import { FileText, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

type Props = {
    location: Location;
};

export function LocationItem({ location }: Props) {
    return (
        <TableRow>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                {location.name}
            </TableCell>
            <TableCell>{location.building || "—"}</TableCell>
            
            {/* 🌟 ESCONDENDO NO MOBILE: Segue a mesma regra do cabeçalho */}
            <TableCell className="hidden md:table-cell">
                {location.floor || "—"}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {location.room || "—"}
            </TableCell>
            
            {/* 🌟 NOTAS: Oculta em celulares muito pequenos, aparece a partir de telas 'sm' */}
            <TableCell className="hidden sm:table-cell text-center">
                {location.notes ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                                title="Ver observações"
                            >
                                <FileText className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-4 text-sm text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 shadow-md border rounded-md">
                            <div className="space-y-1">
                                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Observações</h4>
                                <p className="whitespace-pre-wrap leading-relaxed">{location.notes}</p>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <span className="text-zinc-300 dark:text-zinc-700">—</span>
                )}
            </TableCell>

            {/* AÇÕES */}
            <TableCell>
                <div className="flex items-center gap-2">
                    <Link href={`/infra/locations/edit/${location.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4 text-zinc-500" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}