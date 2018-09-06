export class TableSearch {
    pageNumber: number | string;
    itemsCount: number | string;
    searchTerm?: string;
    filters?: FieldFilter[];
    sorts?: FieldSort[];
}

export class FieldSort {
    sortType: string;
    fieldName: string;
}

export class FieldFilter {
    fieldName: string;
    fieldValue: string;
}

export enum SortType {
    None = 1,
    Asc = 2,
    Desc = 3
}