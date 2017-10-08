import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { CustomValidators } from '../shared/custom-validators';
import { Log } from '../shared/log.service';
import { UserService } from '../shared/user.service';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit {

  @ViewChild(AlertsComponent) alerts: AlertsComponent;

  _loginForm: FormGroup;
  _submitEnabled = true;

  private _params: Params;

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _router: Router,
              private _userService: UserService) {
    this._route.params.subscribe(params => this._params = params);
  }

  _login(event: any): void {
    Log.debug('LoginComponent->login()');

    console.log(this._loginForm.value);

    this._userService.login(this._loginForm.value).subscribe(() => {
      Log.debug('LoginComponent->login: success');

      const target = this._params['target'];
      target ? this._router.navigateByUrl(decodeURIComponent(target)) : this._router.navigate(['dashboard']);

    }, (error: any) => {
      Log.debug('LoginComponent->login: error: ' + error.toLowerCase());

      this.alerts.add({
        type: 'danger',
        message: error
      });

      this._submitEnabled = true;
    });

    this.alerts.clear();
    this._submitEnabled = false;

    event.preventDefault();
  }

  ngOnInit() {
    Log.debug('LoginComponent->ngOnInit()');

    this._loginForm = this._formBuilder.group({
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      password: ['', Validators.compose([Validators.required, CustomValidators.password])]
    });

    if (this._userService.isLogged()) {
      this._userService.userNotLogged();
    }
  }
}
