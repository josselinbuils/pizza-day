import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { constants } from '../shared/constants';
import { Log } from '../shared/log.service';
import { Observable } from 'rxjs/Observable';
import { PizzaService } from '../shared/pizza.service';
import { PizzaDay } from '../shared/pizza-day';
import { Pizzeria } from '../shared/pizzeria';
import { User } from '../shared/user';
import { UserService } from '../shared/user.service';

@Component({
  moduleId: module.id,
  selector: 'app-edit-pizza-day',
  templateUrl: 'edit-pizza-day.component.html',
  styleUrls: ['edit-pizza-day.component.css']
})

export class EditPizzaDayComponent implements OnInit {

  @ViewChild(AlertsComponent) alerts: AlertsComponent;

  _constants = constants;
  _loading = true;
  _pizzaDay: PizzaDay;
  _users: any[];
  _pizzerias: any[];

  _deletePizzaDaySubmitEnabled = true;

  _editInfoForm: FormGroup;
  _editInfoSubmitEnabled = true;

  _editTimesForm: FormGroup;
  _editTimesSubmitEnabled = true;

  _days = [{
    caption: 'Monday',
    value: 1
  }, {
    caption: 'Tuesday',
    value: 2
  }, {
    caption: 'Wednesday',
    value: 3
  }, {
    caption: 'Thursday',
    value: 4
  }, {
    caption: 'Friday',
    value: 5
  }, {
    caption: 'Saturday',
    value: 6
  }, {
    caption: 'Sunday',
    value: 7
  }];

  private _params: Params;

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _router: Router,
              private _pizzaService: PizzaService, private _userService: UserService) {
    this._route.params.subscribe(params => this._params = params);
  }

  _deletePizzaDay(): void {
    Log.debug('EditPizzaDayComponent->_deletePizzaDay()');

    this._pizzaService
      .deletePizzaDay(this._pizzaDay._id)
      .subscribe(() => {
        Log.debug('EditPizzaDayComponent->_deletePizzaDay: success');

        this.alerts.add({
          type: 'success',
          message: 'Pizza day successfully deleted',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS_MOVE,
          close: () => this._router.navigate(['Dashboard'])
        });

      }, error => {
        Log.debug('EditPizzaDayComponent->_deletePizzaDay: error: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._deletePizzaDaySubmitEnabled = true;
      });

    this.alerts.clear();
    this._deletePizzaDaySubmitEnabled = false;
  }

  _editInfo(event: any): void {
    Log.debug('EditPizzaDayComponent->editInfo()');

    this._pizzaService
      .editPizzaDay(this._pizzaDay._id, this._editInfoForm.value)
      .subscribe(() => {
        Log.debug('EditPizzaDayComponent->editInfo: success');

        this.alerts.add({
          type: 'success',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS,
          message: 'Info successfully edited'
        });

        this._editInfoSubmitEnabled = true;

      }, error => {
        Log.debug('EditPizzaDayComponent->editInfo: error: ' + error.toLowerCase());

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

  _editTimes(event: any): void {
    Log.debug('EditPizzaDayComponent->_editTimes()');

    this._pizzaService
      .editPizzaDay(this._pizzaDay._id, this._editTimesForm.value)
      .subscribe(() => {
        Log.debug('EditPizzaDayComponent->_editTimes: success');

        this.alerts.add({
          type: 'success',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS,
          message: 'Times successfully edited'
        });

        this._editTimesSubmitEnabled = true;

      }, error => {
        Log.debug('EditPizzaDayComponent->_editTimes: error: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._editTimesSubmitEnabled = true;
      });

    this.alerts.clear();
    this._editTimesSubmitEnabled = false;

    event.preventDefault();
  }

  _getOwner(): string {
    return this._users.filter((user: any) => user.value === this._pizzaDay.owner._id).length > 0 ? this._pizzaDay.owner._id : null;
  }

  _getParticipants(): string[] {
    const participants = this._pizzaDay.participants.map((user: any) => {
      return this._users.filter((usr: any) => usr.value === user._id).length > 0 ? user._id : null;
    });
    return participants.filter((userId: any) => userId !== null);
  }

  ngOnInit() {
    Log.debug('EditPizzaDayComponent->ngOnInit()');

    Log.debug('EditPizzaDayComponent->ngOnInit: retrieve users and pizzerias');

    Observable.forkJoin([
      this._pizzaService.getPizzaDay(this._params['id']),
      this._userService.getUsers(),
      this._pizzaService.getPizzerias()
    ]).subscribe((res: any) => {
      Log.debug('EditPizzaDayComponent->ngOnInit: users and pizzerias retrieved');

      this._pizzaDay = res[0];

      this._users = (<User[]> res[1]).map((user: any) => {
        return {
          caption: user.lastName + ', ' + user.firstName,
          value: user._id
        };
      });

      this._pizzerias = (<Pizzeria[]> res[2]).map((pizzeria: any) => {
        return {
          caption: pizzeria.name,
          value: pizzeria._id
        };
      });

      this._editInfoForm = this._formBuilder.group({
        day: [this._pizzaDay.day, Validators.required],
        owner: ['', Validators.required],
        participants: ['', Validators.required],
        pizzeria: ['', Validators.required],
      });

      this._editTimesForm = this._formBuilder.group({
        mealTime: [this._pizzaDay.mealTime, Validators.required],
        orderTime: [this._pizzaDay.orderTime, Validators.required],
        purchaseTime: [this._pizzaDay.purchaseTime, Validators.required],
        reminderTime: [this._pizzaDay.reminderTime, Validators.required]
      });

      this._loading = false;

    }, error => {
      Log.debug('EditPizzaDayComponent->ngOnInit: impossible to retrieve users and pizzerias: ' + error.toLowerCase());

      this.alerts.add({
        type: 'danger',
        message: error,
        close: () => this._router.navigate(['Dashboard'])
      });

      this._loading = false;
    });
  }
}
