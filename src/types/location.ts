export type Location = {
    id: string;
    name: string;
    building?: string | null;
    floor?: string | null;
    room?: string | null;
    notes?: string | null;
    createdAt?: string;
    updatedAt?: string;
};
