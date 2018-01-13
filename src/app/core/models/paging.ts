export class PagingResponse<T> {
    data: T[];
    paging: PagingInfo;
}

class PagingInfo {
    pageNumber: number;
    itemsCount: number;
    totalCount: number;
}