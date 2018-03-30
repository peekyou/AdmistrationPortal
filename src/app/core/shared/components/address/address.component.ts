import { Component, OnInit, Input, Output, ViewChild, forwardRef, ElementRef, NgZone } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, FormControl } from "@angular/forms";
import { FormGroup } from '@angular/forms';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';

import { Address } from './address';
import { Lookup } from '../../../models/lookup';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AddressComponent),
            multi: true,
        }
    ],    
})
export class AddressComponent implements OnInit, ControlValueAccessor {
    states = ['Abu Dhabi','Ajman','Dubai','Fujairah','Ras al-Khaimah','Sharjah','Umm al-Quwain'];

    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number;

    private _address: Address = {};
    private _onTouchedCallback: () => {};    
    private _onChangeCallback: (_: Address) => {};
    
    get address(): Address {
        return this._address;
    }
    set address(value: Address) {
        this._address = value;
        this._onChangeCallback(value);
        this._onTouchedCallback();
    }
    
    @Input() showMap = false;
    @Input() hideCountry = false;
    @Input('group') public addressForm: FormGroup;
    // private addressForm: FormGroup;
    
    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(
        private ngZone: NgZone,
        private mapsAPILoader: MapsAPILoader,
        public controlContainer: ControlContainer) {
    }

    ngOnInit() {
        // this.addressForm = <any>this.controlContainer.control;
        var input = document.getElementById('address');
        this.searchControl = new FormControl();
        this.setCurrentPosition();
        this.loadAutocomplete();
    }

    onStateChange(value: string) {
        if (value) {
            var val = value.split(':');
            if (val.length > 0) {
                if (this.address) {
                    this.address.city = val[1].trim();
                }
                else if (this.addressForm) {
                    this.addressForm.controls['city'].setValue(val[1].trim());
                }
            }
        }
    }

    isUAE(): boolean {
        var country = this.addressForm ? this.addressForm.controls['country'].value : this.address.country;
        return country && country.id === 'AE';
    }

    countryChanged(value: Lookup) {
        if (value && value.id && value === 'AE') {
            if (this.address) {
                this.address.zipCode = null;
            }
            if (this.addressForm) {
                this.addressForm.controls['zipCode'].setValue(null);
            }
        }
        else {
            if (this.address) {
                this.address.state = null;
                this.address.area = null;
            }
            if (this.addressForm) {
                this.addressForm.controls['state'].setValue(null);
                this.addressForm.controls['area'].setValue(null);
            }
        }
    }

    private setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
                this.setFormLatLong();
            });
        }
    }

    private loadAutocomplete() {
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
              types: ["address"]
            });
            
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 15;
                    this.fillInAddress(place);
                    this.setFormLatLong();
                });
            });
        });
    }

    private fillInAddress(place: google.maps.places.PlaceResult) {
        var address: string = '';
        var address2: string = null;
        var city: string = null;
        var zipCode: string = null;
        var area: string = null;
        var state: string = null;
        var country: Lookup = null;

        for (var i = 0; i < place.address_components.length; i++) {
            var placeAddress = place.address_components[i];
            var addressType = placeAddress.types[0];

            if (addressType == 'street_number' || addressType == 'route') {
                address += placeAddress['long_name'] + ' ';
            }
            if (addressType == 'locality') {
                city = placeAddress['long_name'];
            }
            if (addressType == 'postal_code') {
                zipCode = placeAddress['short_name'];
            }
            if (addressType == 'administrative_area_level_1') {
                state = placeAddress['short_name'];
            }
            if (addressType == 'country') {
                country = new Lookup(placeAddress['short_name'], placeAddress['long_name']);
            }
        }
        
        if (this.address) {
            this.address.addressLine1 = address;
            this.address.addressLine2 = address2;
            this.address.city = city;
            this.address.state = state;
            this.address.area = area;
            this.address.zipCode = zipCode;
            this.address.country = country;
        }

        if (this.addressForm) {
            this.addressForm.controls['addressLine1'].setValue(address);
            this.addressForm.controls['addressLine2'].setValue(address2);
            this.addressForm.controls['city'].setValue(city);
            this.addressForm.controls['state'].setValue(state);
            this.addressForm.controls['area'].setValue(area);
            this.addressForm.controls['zipCode'].setValue(zipCode);
            this.addressForm.controls['country'].setValue(country);
        }
    }

    private setFormLatLong() {
        if (this.address) {
            this.address.latitude = this.latitude;
            this.address.longitude = this.longitude;
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: Address) {
        this._address = value;
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }
}