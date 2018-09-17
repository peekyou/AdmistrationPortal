import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SearchFilter } from '../models/searchFilter';

@Injectable()
export class SearchService {
    private _searchFilter: SearchFilter;
    private searchSubject: Subject<SearchFilter>;
    searchFilter$: Observable<SearchFilter>;

    constructor() { 
        this.searchSubject = new Subject<SearchFilter>();
        this.searchFilter$ = this.searchSubject.asObservable();        
    }

    set searchFilter(searchFilter: SearchFilter) {
        this._searchFilter = searchFilter;
        this.searchSubject.next(searchFilter);        
    }

    get searchFilter(): SearchFilter {
        return this._searchFilter;
    }
}