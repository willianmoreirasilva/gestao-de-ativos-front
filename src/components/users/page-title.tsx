import type { ReactNode } from "react";

type Props = {
    title: string;
    description?: string; // 🌟 Propriedade opcional de descrição
    leftSide?: ReactNode;
    rightSide?: ReactNode;
};

export const PageTitle = ({
    title,
    description,
    leftSide,
    rightSide,
}: Props) => {
    return (
        <div className="border-b mb-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                {leftSide && (
                    <div className="flex items-center justify-center shrink-0">
                        {leftSide}
                    </div>
                )}
                <div>
                    <h1 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {rightSide && (
                <div className="flex items-center justify-center shrink-0">
                    {rightSide}
                </div>
            )}
        </div>
    );
};
