import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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