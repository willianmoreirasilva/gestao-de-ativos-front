import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
    return (
        <div
            className="space-y-6"
            aria-busy="true"
            aria-label="Carregando usuários"
        >
            <div className="border-b mb-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-4 w-80 max-w-full" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>
            <div className="flex justify-between gap-4">
                <Skeleton className="h-10 w-full max-w-sm" />
                <Skeleton className="h-4 w-32 hidden sm:block" />
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-56 max-w-full" />
                        </div>
                        <Skeleton className="h-5 w-24 hidden sm:block" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                ))}
            </div>
        </div>
    );
}
