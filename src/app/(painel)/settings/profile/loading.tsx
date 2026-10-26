import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
    return (
        <div
            className="space-y-6 max-w-3xl"
            aria-busy="true"
            aria-label="Carregando perfil"
        >
            <div className="border-b mb-4 pb-3 space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <div className="rounded-xl border bg-card p-6 flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-72 max-w-full" />
                </div>
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-xl border bg-card p-6 space-y-4"
                >
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-9 w-36" />
                </div>
            ))}
        </div>
    );
}
