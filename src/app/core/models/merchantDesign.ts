﻿import { Picture } from './picture';

export class MerchantDesign {    
    rewardsWheelColor?: string;
    titlesColor?: string;
    buttonsColor?: string;
    menuBackgroundColor?: string;
    fontFamily?: string;
    logoSrc?: string;
    logo?: Picture;
    backgroundImageSrc?: string;
    backgroundImage?: Picture;
    headerImageSrc?: string;
    headerImage?: Picture;
    backgroundImageSize?: string;

    constructor() {
        this.logo = null;
        this.backgroundImage = null;
        this.headerImage = null;
    }
}