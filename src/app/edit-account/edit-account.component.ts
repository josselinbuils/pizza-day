import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { constants } from '../shared/constants';
import { CustomValidators } from '../shared/custom-validators';
import { Log } from '../shared/log.service';
import { User } from '../shared/user';
import { UserService } from '../shared/user.service';

@Component({
  moduleId: module.id,
  selector: 'app-edit-account',
  templateUrl: 'edit-account.component.html',
  styleUrls: ['edit-account.component.css']
})

export class EditAccountComponent implements OnInit {
  @ViewChild(AlertsComponent) alerts: AlertsComponent;

  _editPasswordForm: FormGroup;
  _editInfoForm: FormGroup;
  _loading = true;

  private _params: Params;
  private _user: User;
  private _deleteAccountSubmitEnabled = true;
  private _editInfoSubmitEnabled = true;
  private _editPasswordSubmitEnabled = true;

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _router: Router,
              private _userService: UserService) {
    this._route.params.subscribe(params => this._params = params);
  }

  _deleteAccount(): void {
    Log.debug('EditAccountComponent->_deleteAccount()');

    this._userService
      .deleteAccount(this._user._id)
      .subscribe(() => {
        Log.debug('EditAccountComponent->_deleteAccount: success');

        this.alerts.add({
          type: 'success',
          message: 'Account successfully deleted',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS_MOVE,
          close: () => this._userService.logout()
        });

      }, error => {
        Log.debug('EditAccountComponent->_deleteAccount: error: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._deleteAccountSubmitEnabled = true;
      });

    this.alerts.clear();
    this._deleteAccountSubmitEnabled = false;
  }

  _editInfo(event: any): void {
    Log.debug('EditAccountComponent->_editInfo()');

    this._userService
      .editAccount(this._user._id, this._editInfoForm.value)
      .subscribe(() => {
        Log.debug('EditAccountComponent->_editInfo: success');

        this.alerts.add({
          type: 'success',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS,
          message: 'Info successfully edited'
        });

        this._editInfoSubmitEnabled = true;

      }, error => {
        Log.debug('EditAccountComponent->_editInfo: error: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._editInfoSubmitEnabled = true;

      });

    this.alerts.clear();
    this._editInfoSubmitEnabled = false;

    event.preventDefault();
  }

  _editPassword(event: any): void {
    Log.debug('EditAccountComponent->_editPassword()');

    this._userService
      .editAccount(this._user._id, {password: this._editPasswordForm.value.password})
      .subscribe(() => {
        Log.debug('EditAccountComponent->_editPassword: success');

        this.alerts.add({
          type: 'success',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS,
          message: 'Password successfully edited'
        });

        const controls = this._editPasswordForm.controls;

        (<FormControl> controls['password']).setValue('');
        (<FormControl> controls['confirmPassword']).setValue('');

        this._editPasswordSubmitEnabled = true;

      }, error => {
        Log.debug('EditAccountComponent->_editPassword: error: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._editPasswordSubmitEnabled = true;

      });

    this.alerts.clear();
    this._editPasswordSubmitEnabled = false;

    event.preventDefault();
  }

  ngOnInit() {
    Log.debug('EditAccountComponent->ngOnInit()');

    Log.debug('EditAccountComponent->ngOnInit: retrieve user');

    this._userService
      .getUser(this._params['id'])
      .subscribe((user: any) => {
        Log.debug('EditAccountComponent->ngOnInit: user retrieved');

        this._user = user;

        this._editInfoForm = this._formBuilder.group({
          email: [user.email],
          firstName: [user.firstName, Validators.required],
          lastName: [user.lastName, Validators.required]
        });

        this._editPasswordForm = this._formBuilder.group({
          password: ['', Validators.compose([Validators.required, CustomValidators.password])],
          confirmPassword: ['', Validators.compose([Validators.required, CustomValidators.password])]
        }, {validator: CustomValidators.confirmPassword});

        this._loading = false;

      }, error => {
        Log.debug('EditAccountComponent->ngOnInit: impossible to retrieve user: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error,
          close: () => this._router.navigate(['Dashboard'])
        });

        this._loading = false;
      });
  }
}
