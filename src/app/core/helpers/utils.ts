import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import * as moment from 'moment';

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function registerSw() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
}

export function ngbDateStructToDate(date: NgbDateStruct): Date {
    if (!date) return null;
    return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

export function dateToNgbDateStruct(date: Date | string): NgbDateStruct {                
    if (!date) return null;
    if (typeof date === 'string') {
        var mDate = moment.utc(date);
        return  { year: mDate.year(), month: mDate.month() + 1, day: mDate.date() };
    }
    return  { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function normalizeNumber(n: string | number): string {
    const num = typeof n === 'string' ? parseInt(n, 10) : n;
    return num < 10 ? `0${n}` : '' + n;
}

export function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export function dateLessThanValidation(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
        let f = group.controls[from];
        let t = group.controls[to];
        if (f.value && t.value && ngbDateStructToDate(f.value) > ngbDateStructToDate(t.value)) {
            return {
                dates: 'From date must be before to date'
            };
        }
        return {};
    }
}

export function isMobileNumber(searchTerm: string): boolean {
    if (searchTerm && (searchTerm.startsWith('+') || searchTerm.startsWith('0'))) {
        var cleaned = searchTerm.replace(/[\+_\-\s]/g, '');
        return /^[\d]+$/.test(cleaned);
    }
    return false;
}

export function validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
            validateAllFormFields(control);
        }
    });
}

export function clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
        formArray.removeAt(0)
    }
}

export function uniqChars(str) {
    return str.replace(/[A-Za-z](?=([A-Za-z]+))/g, function(c, s) {
        return s.indexOf(c) + 1 ? '' : c;
    });
}