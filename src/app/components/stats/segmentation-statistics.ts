import { PieChartData } from '../../core/shared/components/pie-chart/pie-chart';

export class SegmentationStatistics {
    genderSegmentation: PieChartData;
    ageSegmentation: PieChartData;
    languageSegmentation: PieChartData;
}

export enum DataType {
    Gender = 1,
    Age,
    Languages,
    City,
    Country,
    Nationality
}