export interface OptionItem {
    id: string;
    name: string;
}

export interface SwitchOptionItem {
    id: string;
    hostname: string;
    model?: string | null;
    vendor?: string | null;
}

export interface ReportOptions {
    departments: OptionItem[];
    locations: OptionItem[];
    networks: OptionItem[];
    processors: OptionItem[];
    operatingSystems: OptionItem[];
    disks: OptionItem[];
    switches: SwitchOptionItem[];
}
