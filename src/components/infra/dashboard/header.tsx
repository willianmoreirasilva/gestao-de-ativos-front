//Componente de Título/Header Reutilizável

type Props = {
    title: string;
    description?: string;
};

export function DashboardHeader({ title, description }: Props) {
    return (
        <div className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {title}
            </h1>
            {description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {description}
                </p>
            )}
        </div>
    );
}
