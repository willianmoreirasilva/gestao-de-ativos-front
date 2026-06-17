import type { ReactNode } from "react";

type Props = {
    title: string;
    leftSide?: ReactNode;
    rightSide?: ReactNode;
};
export const PageTitle = ({ title, leftSide, rightSide }: Props) => {
    return (
        <h1 className="border-b mb-4 pb-2 flex items-center">
            {leftSide && <div className="mr-2">{leftSide}</div>}
            <div className="font-bold text-2xl flex-1">{title}</div>
            {rightSide && <div className="ml-2">{rightSide}</div>}
        </h1>
    );
};
