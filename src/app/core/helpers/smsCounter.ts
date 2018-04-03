import { Injectable } from '@angular/core';

@Injectable()
export class SmsCounter {
    private static gsm7bitChars = "@£$¥èéùìòÇ\\nØø\\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\\\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
    private static gsm7bitExChar = "\\^{}\\\\\\[~\\]|€";
    private static gsm7bitRegExp = RegExp("^[" + SmsCounter.gsm7bitChars + "]*$");
    private static gsm7bitExRegExp = RegExp("^[" + SmsCounter.gsm7bitChars + SmsCounter.gsm7bitExChar + "]*$");
    private static gsm7bitExOnlyRegExp = RegExp("^[\\" + SmsCounter.gsm7bitExChar + "]*$");
    private static GSM_7BIT = 'GSM_7BIT';
    private static GSM_7BIT_EX = 'GSM_7BIT_EX';
    private static UTF16 = 'UTF16';
    private static messageLength = {
        GSM_7BIT: 160,
        GSM_7BIT_EX: 160,
        UTF16: 70
    };
    private static multiMessageLength = {
        GSM_7BIT: 153,
        GSM_7BIT_EX: 153,
        UTF16: 67
    };
    
    public static count(text) {
        var count, encoding, length, messages, per_message, remaining;
        encoding = SmsCounter.detectEncoding(text);
        length = text.length;
        if (encoding === SmsCounter.GSM_7BIT_EX) {
            length += SmsCounter.countGsm7bitEx(text);
        }
        per_message = SmsCounter.messageLength[encoding];
        if (length > per_message) {
            per_message = SmsCounter.multiMessageLength[encoding];
        }
        messages = Math.ceil(length / per_message);
        remaining = (per_message * messages) - length;
        if(remaining == 0 && messages == 0){
            remaining = per_message;
        }
        return count = {
            encoding: encoding,
            length: length,
            per_message: per_message,
            remaining: remaining,
            messages: messages
        };
    };
    
    private static detectEncoding(text) {
        switch (false) {
        case text.match(SmsCounter.gsm7bitRegExp) == null:
            return SmsCounter.GSM_7BIT;
        case text.match(SmsCounter.gsm7bitExRegExp) == null:
            return SmsCounter.GSM_7BIT_EX;
        default:
            return SmsCounter.UTF16;
        }
    };
    
    private static countGsm7bitEx(text) {
        var char2, chars;
        chars = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = text.length; _i < _len; _i++) {
            char2 = text[_i];
            if (char2.match(SmsCounter.gsm7bitExOnlyRegExp) != null) {
                _results.push(char2);
            }
        }
        return _results;
        }).call(this);
        return chars.length;
    };
}