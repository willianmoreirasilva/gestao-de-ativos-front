type Props = { errors?: string[] };

export function FieldError({ errors }: Props) {
    if (!errors) return null;
    return <p className="text-sm text-destructive">{errors[0]}</p>;
}
