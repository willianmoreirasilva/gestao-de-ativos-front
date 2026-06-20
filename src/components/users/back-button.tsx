"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

type Props = {
    fallbackUrl: string;
};

export const BackButton = ({ fallbackUrl }: Props) => {
    return (
        <Link href={fallbackUrl}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeftIcon className="h-4 w-4" />
            </Button>
        </Link>
    );
};