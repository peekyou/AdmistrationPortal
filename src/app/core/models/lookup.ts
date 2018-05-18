export class Lookup {
    name?: string;
    id?: string;
    parentId?: string;

    constructor(id: string, name: string, parentId?: string) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
    }

    static getValue(lookup: Lookup | string): string {
        if (typeof lookup === 'string') {
            return lookup;
        }
        else if (lookup && lookup.name) {
            return lookup.name;
        }
        return null;
    }
}