import type { ReactNode } from "react";

type Props = {
    title: string;
    leftSide?: ReactNode; // 🌟 Permite injetar o BackButton ou qualquer outro elemento aqui
    rightSide?: ReactNode;
};

export const PageTitle = ({ title, leftSide, rightSide }: Props) => {
    return (
        <div className="border-b mb-4 pb-2 flex items-center gap-2">
            {leftSide && (
                <div className="flex items-center justify-center">
                    {leftSide}
                </div>
            )}
            <h1 className="font-bold text-2xl flex-1 text-zinc-900 dark:text-zinc-50">
                {title}
            </h1>
            {rightSide && (
                <div className="flex items-center justify-center">
                    {rightSide}
                </div>
            )}
        </div>
    );
};