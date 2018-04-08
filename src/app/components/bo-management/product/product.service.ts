import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { APP_CONFIG, AppConfig } from '../../../app.config';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { Product } from './product';
import { PagingResponse } from '../../../core/models/paging';


@Injectable()
export class ProductService {
    private api: string;
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint + '/products';
    }

    getProducts(page: number, count: number): Observable<PagingResponse<Product>> {
        return this.http.get(this.api + '?pageNumber=' + page + '&itemsCount=' + count);
    }

    createProduct(product: Product): Observable<any> {
        return this.http.post(this.api, product);
    }

    editProduct(product: Product): Observable<void> {
        return this.http.put(this.api + '/' + product.id, product);
    }

    deleteProduct(product: Product): Observable<void> {
        return this.http.delete(this.api + '/' + product.id);
    }
}