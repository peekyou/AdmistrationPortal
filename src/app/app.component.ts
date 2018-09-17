import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { D3Service, D3, FormatLocaleDefinition } from 'd3-ng2-service';
import { AppState } from './app.service';
import { UserService } from './components/user/user.service';
import { LookupService } from './core/services/lookup.service';
import { APP_CONFIG, AppConfig } from './app.config';
import { uniqChars  } from './core/helpers/utils';
import * as moment from 'moment';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <app-header *ngIf="user.isAuthenticated()"></app-header>
    <div id="parent" [ngClass]="{'sidebar-margin': user.isAuthenticated()}">
      <app-sidebar *ngIf="user.isAuthenticated()"></app-sidebar>
      <main>
        <app-notifications></app-notifications>
        <router-outlet></router-outlet>
      </main>

      <footer>
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
  private d3: D3;

  constructor(
    @Inject(APP_CONFIG) config: AppConfig,
    private router: Router,
    private translate: TranslateService, 
    private d3Service: D3Service,
    public user: UserService, 
    public lookup: LookupService) {

    // translate.addLangs(["en", "fr"]);
    translate.setDefaultLang('en');

    // let browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    translate.use(config.Lang ? config.Lang : 'en');
    moment.locale(config.Lang);

    this.d3 = d3Service.getD3();
    this.setD3TimeFormatLocale(moment.locale());
    this.setD3NumberFormatLocale(moment.locale());
  }

    ngOnInit() {
      this.router.events.subscribe((evt) => {
          if (!(evt instanceof NavigationEnd)) {
              return;
          }
          window.scrollTo(0, 0)
      });
    }
      
    // https://unpkg.com/d3-time-format@2.1.3/locale/
    private setD3TimeFormatLocale(locale?: string) {
      var localeData = moment.localeData();
      var momentLocaleDateFormat = localeData.longDateFormat('L');
      var d3LocaleDateFormat = uniqChars(momentLocaleDateFormat)
        .replace('D', '%d')
        .replace('M', '%m')
        .replace('Y', '%Y');
        
      var momentLocaleTimeFormat = localeData.longDateFormat('LTS');
      var d3LocaleTimeFormat = uniqChars(momentLocaleTimeFormat)
      .replace('h', '%I') // hours 12
      .replace('H', '%H') // hours 24
      .replace('A', '%p') // meridiem
      .replace('m', '%M') // minutes
      .replace('s', '%S'); // seconds

      this.d3.timeFormatDefaultLocale({
          dateTime: "%A, le %e %B %Y, %X",
          date: d3LocaleDateFormat,
          time: d3LocaleTimeFormat,
          periods: locale == 'fr' ? ["", ""] : ["AM", "PM"],
          days: <any>localeData.weekdays(),
          shortDays: <any>localeData.weekdaysShort(),
          months: <any>localeData.months(),
          shortMonths: <any>localeData.monthsShort()
      });
    }

    // https://unpkg.com/d3-format@1.3.2/locale/
    private setD3NumberFormatLocale(locale?: string) {
      var format: FormatLocaleDefinition =  {
        "decimal": ".",
        "thousands": ",",
        "grouping": [3],
        "currency": ["$", ""]
      };

      if (locale == 'fr') {
        format = {
            "decimal": ",",
            "thousands": "\u00a0",
            "grouping": [3],
            "currency": ["", "\u00a0€"],
            "percent": "\u202f%"
        };
      }

      this.d3.formatDefaultLocale(format);
    }
}