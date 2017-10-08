import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Log } from './shared/log.service';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _router: Router, private _userService: UserService) {
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
        } else {
          Log.debug('PizzaDayAppComponent->ngOnInit: user not logged, display login component');

          const unsecuredTarget = /^\/(about|login)/;

          if (target.length === 0) {
            this._router.navigate(['/login']);
          } else if (!unsecuredTarget.test(target)) {
            this._router.navigate(['/login', {target: encodeURIComponent(target)}]);
          }
        }
      }, error => {
        Log.debug('PizzaDayAppComponent->ngOnInit: error: ' + error.toLowerCase());
        this._router.navigate(['/login']);
      });
  }
}
