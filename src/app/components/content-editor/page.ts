import { Picture } from '../../core/shared/components/file-upload/picture'; 
import { Address } from '../../core/shared/components/address/address'; 

export class Page {
    id?: string;
    typeId: number;
    title: string;
    content?: string;
    order?: number;
    numbering?: string;
    pictures?: Picture[];
    parentId?: string;
    children?: Page[];
    timeTable?: TimeTable[];
    data1?: string;
    data2?: string;
    data3?: string;
    data4?: string;
    data5?: string;
    data6?: string;
    data7?: string;
    data8?: string;
    data9?: string;
    data10?: string;
    editable?: boolean;
    draggable?: boolean;
    expandable?: boolean;
    expanded?: boolean;
    editing?: boolean;
    selected?: boolean;
    address?: Address;
}

export class CallOption {
    id: string;
    label: string;
}

export class TimeTable {
    id?: string;
    day: number;
    nonStop?: boolean;
    morningTime?: string;
    afternoonTime?: string;
}

export class WeekDay {
    id: number;
    name: string;
}