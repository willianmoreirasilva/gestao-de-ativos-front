type Props = { errors?: string[] };

export function FieldError({ errors }: Props) {
    // Evita renderizar se não houver o array ou se o array estiver vazio
    if (!errors || errors.length === 0) return null;
    
    return <p className="text-xs font-medium text-destructive mt-1 animate-in fade-in-50 duration-150">{errors[0]}</p>;
}