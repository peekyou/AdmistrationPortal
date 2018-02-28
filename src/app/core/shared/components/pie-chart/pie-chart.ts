export class PieChartData {
    name: string;
    details: PieChartDetail[];
}

export class PieChartDetail {
    count: number;
    label: string;
    percentage?: number;
}