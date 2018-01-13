interface String {
    format(...args: string[]): string;
    replaceAt(index: number, replacement: string): string;
    removeAt(index: number, length?: number): string;
}

String.prototype.format = function (max, decorator) {
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }
    return str;
};

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

String.prototype.removeAt = function (index: number, length?: number) {
    if (length == null) length = 1;
    return this.slice(0, index) + this.slice(index + length);
}