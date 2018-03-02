export interface ChartData {
    label?: string;
}

export class GroupBarChartData implements ChartData {
    constructor(public label: string, public details: BarChartData[]) { 

    }
}

export class BarChartData implements ChartData {
    constructor(public label: string, public value: number) { 

    }
}