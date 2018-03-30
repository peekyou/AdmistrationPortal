import { Component, Input } from '@angular/core';
@Component({
    selector: 'app-etiquette-card',
    styleUrls: ['./etiquette-card.component.scss'],
    templateUrl: './etiquette-card.component.html'
})
export class EtiquetteCardComponent {
    @Input() image: string;
    @Input() imageWidth: number = 29;
    @Input() background: string;
}