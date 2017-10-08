import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  moduleId: module.id,
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['user-panel.component.css'],
})

export class UserPanelComponent {

  _buttons = [{
    name: 'Home',
    icon: 'fa-home',
    click: () => this._router.navigate(['dashboard']),
    hidden: () => !this._isLogged() || this._isRouteActive('/dashboard')
  }, {
    name: 'Pizzerias',
    icon: 'fa-cutlery',
    click: () => this._router.navigate(['pizzerias']),
    hidden: () => !this._isLogged() || this._isRouteActive('/pizzerias')
  }, {
    name: 'Create account',
    icon: 'fa-user-plus',
    click: () => this._router.navigate(['createAccount']),
    hidden: () => this._isLogged() || this._isRouteActive('/createAccount')
  }, {
    name: 'Edit account',
    icon: 'fa-user',
    click: () => this._router.navigate(['editAccount', {id: this._userService.getId()}]),
    hidden: () => !this._isLogged() || this._isRouteActive('/editAccount/' + this._userService.getId())
  }, {
    name: 'About',
    icon: 'fa-info-circle',
    click: () => this._router.navigate(['about']),
    hidden: () => this._isRouteActive('/about')
  }, {
    name: 'Login',
    icon: 'fa-sign-in',
    click: () => this._router.navigate(['login']),
    hidden: () => this._isLogged() || this._isRouteActive('/login')
  }, {
    name: 'Logout',
    icon: 'fa-sign-out',
    click: () => this._userService.logout(),
    hidden: () => !this._isLogged()
  }];

  constructor(private _router: Router, private _userService: UserService) {
  }

  _getUserFullName(): string {
    return this._userService.getFullName();
  }

  _isRouteActive(path: string): boolean {
    return (this._router.url).indexOf(path) === 0;
  }

  _isLogged(): boolean {
    return this._userService.isLogged();
  }
}
