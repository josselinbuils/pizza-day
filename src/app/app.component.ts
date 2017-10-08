import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from './shared/data.service';
import { Log } from './shared/log.service';
import { UserService } from './shared/user.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(_dataService: DataService, private _router: Router, private _userService: UserService) {
    _dataService.setPrefix((<any> this._router).location._baseHref);
  }

  ngOnInit() {
    Log.debug('PizzaDayAppComponent->ngOnInit()');

    const target = this._router.url;

    Log.debug('PizzaDayAppComponent->ngOnInit: check if user is logged');

    this._userService
      .checkIfLogged()
      .subscribe((logged: any) => {
        if (logged) {
          Log.debug('PizzaDayAppComponent->ngOnInit: user logged');
          this._router.navigate(['/dashboard']);
        } else {
          Log.debug('PizzaDayAppComponent->ngOnInit: user not logged, display login component');

          const unsecuredTarget = /^\/(about|login)/;

          if (target.length > 1) {
            this._router.navigate(['/login', {target: encodeURIComponent(target)}]);
          } else if (!unsecuredTarget.test(target)) {
            this._router.navigate(['/login']);
          }
        }
      }, error => {
        Log.debug('PizzaDayAppComponent->ngOnInit: error: ' + error.toLowerCase());
        this._router.navigate(['/login']);
      });
  }
}
