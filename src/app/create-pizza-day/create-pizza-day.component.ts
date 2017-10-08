import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { constants } from '../shared/constants';
import { Log } from '../shared/log.service';
import { PizzaService } from '../shared/pizza.service';
import { Pizzeria } from '../shared/pizzeria';
import { User } from '../shared/user';
import { UserService } from '../shared/user.service';

@Component({
  moduleId: module.id,
  selector: 'app-create-pizza-day',
  templateUrl: 'create-pizza-day.component.html',
  styleUrls: ['create-pizza-day.component.css']
})

export class CreatePizzaDayComponent implements OnInit {

  @ViewChild(<any>AlertsComponent) alerts: AlertsComponent;

  _constants = constants;
  _createPizzaDayForm: FormGroup;
  _loading = true;
  _pizzerias: any[];
  _submitEnabled = true;
  _users: any[];

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

  constructor(private _formBuilder: FormBuilder, private _router: Router, private _pizzaService: PizzaService,
              private _userService: UserService) {
  }

  _createPizzaDay(event: any) {
    Log.debug('CreatePizzaDayComponent->_createPizzaDay()');

    this._pizzaService
      .createPizzaDay(this._createPizzaDayForm.value)
      .subscribe(() => {
        Log.debug('CreatePizzaDayComponent->createPizzaDay: success');

        this.alerts.add({
          type: 'success',
          message: 'Pizza day successfully created',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS_MOVE,
          close: () => this._router.navigate(['dashboard'])
        });

      }, error => {
        Log.debug('CreatePizzaDayComponent->createPizzaDay: error: ' + error.toLowerCase());

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

  _getUserId(): string {
    return this._userService.getId();
  }

  _isAdmin(): boolean {
    return this._userService.isAdmin();
  }

  ngOnInit() {
    Log.debug('CreatePizzaDayComponent->ngOnInit()');

    Log.debug('CreatePizzaDayComponent->ngOnInit: retrieve users and pizzerias');

    Observable.forkJoin([
      this._userService.getUsers(),
      this._pizzaService.getPizzerias()
    ]).subscribe((res: any) => {
      Log.debug('CreatePizzaDayComponent->ngOnInit: users and pizzerias retrieved');

      this._users = (<User[]> res[0]).map((user: any) => {
        return {
          caption: user.lastName + ', ' + user.firstName,
          value: user._id
        };
      });

      this._pizzerias = (<Pizzeria[]> res[1]).map((pizzeria: any) => {
        return {
          caption: pizzeria.name,
          value: pizzeria._id
        };
      });

      this._createPizzaDayForm = this._formBuilder.group({
        day: ['', Validators.required],
        mealTime: ['12:15', Validators.required],
        orderTime: ['11:00', Validators.required],
        owner: [this._getUserId(), Validators.required],
        participants: ['', Validators.required],
        pizzeria: ['', Validators.required],
        purchaseTime: ['12:00', Validators.required],
        reminderTime: ['10:00', Validators.required]
      });

      this._loading = false;

    }, error => {
      Log.debug('CreatePizzaDayComponent->ngOnInit: impossible to retrieve users and pizzerias: ' + error.toLowerCase());

      this.alerts.add({
        type: 'danger',
        message: error,
        close: () => this._router.navigate(['dashboard'])
      });

      this._loading = false;
    });
  }
}
