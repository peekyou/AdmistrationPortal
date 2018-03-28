import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from './app.service';
import { UserService } from './components/user/user.service';
import { LookupService } from './core/services/lookup.service';

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
        <router-outlet></router-outlet>
      </main>

      <footer>
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
public angularclassLogo = 'assets/img/angularclass-avatar.png';
public name = 'Angular 2 Webpack Starter';
public url = 'https://twitter.com/AngularClass';

constructor(
  private router: Router,
  private translate: TranslateService, 
  public user: UserService, 
  public lookup: LookupService) {

  translate.addLangs(["en", "fr"]);
  translate.setDefaultLang('en');

  let browserLang = translate.getBrowserLang();
  // translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
  }
}