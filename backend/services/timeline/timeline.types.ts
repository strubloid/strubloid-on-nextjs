export interface TimelineItem {
    id: string;
    year: string | number;
    title: string;
    company?: string;
    position?: string;
    description: string;
    skills?: string[];
    highlights?: string[];
    color?: string;
}

export type TimelineData = TimelineItem[];
