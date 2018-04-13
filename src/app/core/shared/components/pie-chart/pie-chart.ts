export class PieChartData {
    name: string;
    details: PieChartDetail[];
}

export class PieChartDetail {
    count: number;
    key: string;
    label: string;
    percentage?: number;
}