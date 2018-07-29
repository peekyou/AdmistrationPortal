import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
    message: string;
    private _serverStatus = new Subject<string>();

    _error: boolean | string;
    _errorObject: any;
    @Output() errorChange: EventEmitter<boolean | string> = new EventEmitter();
    @Input() successMessage: string;
    @Input() errorMessage: string;

    @Input() 
    get error(): boolean | string {
        return this._error;
    }

    set error(value: boolean | string) {
        this._error = value;
        if (typeof value === 'string') {
            this.getErrorMessageTranslation(value);
        }
        else {
            if (this._error === true) {
                this._serverStatus.next(this.errorMessage);
            }
            else if (this._error === false) {
                this._serverStatus.next(this.successMessage);
            }
        }
    }
    
    constructor(private translation: TranslationService) {
     }

    ngOnInit() {
        this._serverStatus.subscribe((message) => this.message = message);
        debounceTime.call(this._serverStatus, 5000).subscribe(() => this.clear());
    }

    clear() {
        this.message = null
        this._error = null;
        this.errorChange.emit(this._error);
    }

    getErrorMessageTranslation(messageKey: string) {
        this.translation.get('ERRORS.' + messageKey, x => {
            this.errorMessage = x;
            this.error = true;
        });
    }
}