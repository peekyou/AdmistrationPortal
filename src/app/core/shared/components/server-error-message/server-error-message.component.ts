import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-server-error-message',
    templateUrl: './server-error-message.component.html'
})
export class ServerErrorMessageComponent implements OnInit {
    message: string;

    _error: boolean | string;
    @Input() defaultMessage: string;

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
                this.message = this.defaultMessage;
            }
        }
    }
    
    constructor(private translation: TranslationService) {
     }

    ngOnInit() { }

    getErrorMessageTranslation(messageKey: string) {
        this.translation.get('ERRORS.' + messageKey, x => {
            this.message = x;
            this._error = true;
        });
    }
}