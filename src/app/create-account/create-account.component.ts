import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { constants } from '../shared/constants';
import { CustomValidators } from '../shared/custom-validators';
import { Log } from '../shared/log.service';
import { UserService } from '../shared/user.service';

@Component({
  moduleId: module.id,
  selector: 'app-create-account',
  templateUrl: 'create-account.component.html',
  styleUrls: ['create-account.component.css']
})

export class CreateAccountComponent implements OnInit {
  @ViewChild(AlertsComponent) alerts: AlertsComponent;

  _createAccountForm: FormGroup;
  _submitEnabled = true;

  constructor(private _formBuilder: FormBuilder, private _router: Router, private _userService: UserService) {
  }

  _createAccount(event: any): void {
    Log.debug('CreateAccountComponent->_createAccount()');

    this._userService.createAccount({
      email: this._createAccountForm.value.email,
      firstName: this._createAccountForm.value.firstName,
      lastName: this._createAccountForm.value.lastName,
      password: this._createAccountForm.value.password
    }).subscribe(() => {
      Log.debug('CreateAccountComponent->_createAccount: success');

      this.alerts.add({
        type: 'success',
        message: 'Account successfully created'
      });

      Log.debug('CreateAccountComponent->_createAccount: log user in');

      this._userService.login({
        email: this._createAccountForm.value.email,
        password: this._createAccountForm.value.password
      }).subscribe(() => {
        Log.debug('CreateAccountComponent->login: success');

        this.alerts.add({
          type: 'success',
          message: 'Successfully logged in',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS_MOVE,
          close: () => this._router.navigate(['dashboard'])
        });

      }, error => {
        Log.debug('CreateAccountComponent->_createAccount: login error: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });
      });

    }, error => {
      Log.debug('CreateAccountComponent->_createAccount: error: ' + error.toLowerCase());

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
    Log.debug('CreateAccountComponent->ngOnInit()');

    this._createAccountForm = this._formBuilder.group({
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, CustomValidators.password])],
      confirmPassword: ['', Validators.compose([Validators.required, CustomValidators.password])]
    }, {validator: CustomValidators.confirmPassword});
  }
}
