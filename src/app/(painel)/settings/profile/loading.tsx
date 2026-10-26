import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
    return (
        <div
            className="mx-auto w-full max-w-3xl space-y-6"
            aria-busy="true"
            aria-label="Carregando perfil"
        >
            <div className="border-b mb-4 pb-3 space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="h-24 sm:h-28 bg-muted" />
                <div className="-mt-14 pb-6 px-6 flex flex-col items-center gap-3">
                    <Skeleton className="h-28 w-28 rounded-full ring-4 ring-card" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72 max-w-full" />
                    <Skeleton className="h-8 w-32" />
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
