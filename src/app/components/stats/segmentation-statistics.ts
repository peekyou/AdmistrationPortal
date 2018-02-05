export class SegmentationStatistics {
    genderSegmentation: Segmentation;
    ageSegmentation: Segmentation;
    languageSegmentation: Segmentation;
}

export class Segmentation {
    name: string;
    details: SegmentationDetail[];
}

export class SegmentationDetail {
    count: number;
    label: string;
    percentage?: number;
}

export enum DataType {
    Gender = 1,
    Age,
    Languages,
    City,
    Country,
    Nationality
}

// export class GenderSegmentation extends Segmentation
// {
//     gender: string;
// }

// export class AgeSegmentation extends Segmentation
// {
//     age: number;
// }

// export class LanguageSegmentation extends Segmentation
// {
//     language: string;
// }