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





// export class GroupedStatistics {
//     genderChart: GroupedChart;
//     ageChart: GroupedChart;
//     languageChart: GroupedChart;
// }

// export class GroupedChart {
//     groups: StatisticGroup[];
// }

// export class StatisticGroup {
//     name: string;
//     details: StatisticGroupDetail[];
// }

// export class StatisticGroupDetail {
//     label: string;
//     value: string;
// }