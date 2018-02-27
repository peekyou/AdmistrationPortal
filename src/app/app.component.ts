import { Component, ViewEncapsulation } from '@angular/core';
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
    <app-header></app-header>
    <div class="container-fluid" style="padding-left:0">
      <div class="row">
        <div class="col-sm-3 col-lg-2 col-2 p-l-0 p-r-0">
          <app-sidebar></app-sidebar>
        </div>
        
        <main class="col-sm-9 col-lg-10 col-10">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <footer>
    </footer>
  `
})
export class AppComponent {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';

  constructor(private translate: TranslateService, user: UserService, lookup: LookupService) {
    translate.addLangs(["en", "fr"]);
    translate.setDefaultLang('en');

    let browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
}