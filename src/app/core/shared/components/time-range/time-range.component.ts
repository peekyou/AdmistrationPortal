import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import '../../../helpers/stringExtension';

@Component({
    selector: 'app-time-range',
    styleUrls: ['./time-range.component.scss'],
    templateUrl: './time-range.component.html'
})
export class TimeRangeComponent implements OnInit {
    control: FormControl = this.fb.control('');
    private mask = '__:__ - __:__';

    @Input() day: number;
    @Input() type: string;
    @Input() time: string;
    @Input() id: string;
    @Output() timeChange: EventEmitter<any> = new EventEmitter();
    @ViewChild('input') el: ElementRef;

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        if (this.time) {
            var masked = this.applyMask(this.time);
            this.writeValue(masked);
        }
    }

    onFocus() {
        if (!this.control.value) {
            this.writeValue(this.mask);
            this.el.nativeElement.setSelectionRange(0, 0);
        }
    }

    onFocusOut() {
        if (!this.isValid()) {
            this.writeValue('');
        }
    }

    onKeyPress(event: KeyboardEvent) {
        if (!/^[0-9]$/.test(event.key)) {
            event.preventDefault();
        }
    }

    onChanges(event) {
        let start = this.el.nativeElement.selectionStart;
        var valueWithoutMask = this.control.value.replace(/[^\d_]/g, '');
        if (start > -1) {
            valueWithoutMask = valueWithoutMask.removeAt(start);
        }
        var masked = this.applyMask(valueWithoutMask);
        this.writeValue(masked);
        var nextIndex = this.getNextIndex(masked, start);
        this.el.nativeElement.setSelectionRange(nextIndex, nextIndex);

        if (this.isValid()) {
            this.time = this.getTimeFromInput();
            this.timeChange.emit({ dayId: this.day, type: this.type, time: this.time });
        }
        else {
            this.timeChange.emit({ dayId: this.day, type: this.type, time: null });
        }
    }

    getTimeFromInput(): string {
        var regex = /__/g;
        var match = regex.exec(this.mask);
        var result = '';
        for (let i = 0; i < 4; i++) {
            result += this.control.value.substr(match.index, match[0].length);
            match = regex.exec(this.mask);
        }
        return result;
    }

    isValid(): boolean {
        return this.control.value.indexOf('_') === -1;
    }

    writeValue(value: string) {
        this.control.setValue(value, {
            onlySelf: false,
            emitEvent: false,
            emitModelToViewChange: true,
            emitViewToModelChange: false
        });
    }

    getNextIndex(str: string, startIndex?: number) {
        startIndex = startIndex ? startIndex : 0;
        for (let i = startIndex; i < str.length; i++) {
            let c = str.charAt(i);
            if ((c >= '0' && c <= '9') || c === '_') {
                return i;
            }
        }
        return -1;
    }

    applyMask(str: string): string {
        var newValue = this.mask;
        var result = this.mask;
        for (var n = 0; n < str.length && n < 8; n++) {
            //newValue = newValue.replace('_', str.charAt(n));

            //var nth = -1;
            //newValue = newValue.replace(/_/g, function (match, i, original) {
            //    nth++;
            //    return (nth === n) ? str.charAt(n) : match;
            //});
            
            var myRegex = /_/g;
            var arr = null;
            var nth = -1;

            while ((arr = myRegex.exec(this.mask)) != null) {
                nth++;
                // arr.index gives the starting index of the match
                if (nth === n) {
                    // Assign new value to result
                    result = result.substring(0, arr.index) +
                        str.charAt(n) +
                        result.substring(myRegex.lastIndex);
                    break;
                }

                // Increment lastIndex of myRegex if the regex matches an empty string
                // This is important to prevent infinite loop
                if (arr[0].length == 0) {
                    myRegex.lastIndex++;
                }
            }
        }
        return result;
    }
}