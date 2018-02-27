import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';


@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
    message: string;
    private _serverStatus = new Subject<string>();

    _error: boolean;
    @Output() errorChange: EventEmitter<boolean> = new EventEmitter();
    @Input() successMessage: string;
    @Input() errorMessage: string;

    @Input() 
    get error(): boolean {
        return this._error;
    }

    set error(value: boolean) {
        this._error = value;
        if (this._error === true) {
            this._serverStatus.next(this.errorMessage);
        }
        else if (this._error === false) {
            this._serverStatus.next(this.successMessage);
        }
    }
   
    constructor() { }

    ngOnInit() {
        this._serverStatus.subscribe((message) => this.message = message);
        debounceTime.call(this._serverStatus, 5000).subscribe(() => this.clear());
    }

    clear() {
        this.message = null
        this._error = null;
        this.errorChange.emit(this._error);
    }
}