import { Component, OnInit, ViewChild } from '@angular/core';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { Log } from '../shared/log.service';
import { PizzaDay } from '../shared/pizza-day';
import { PizzaService } from '../shared/pizza.service';
import { User } from '../shared/user';
import { UserService } from '../shared/user.service';

@Component({
  moduleId: module.id,
  selector: 'app-pizza-day-list',
  templateUrl: 'pizza-day-list.component.html',
  styleUrls: ['pizza-day-list.component.css']
})

export class PizzaDayListComponent implements OnInit {

  @ViewChild(AlertsComponent) alerts: AlertsComponent;

  _days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  _loading = true;
  _pizzaDays: PizzaDay[] = [];

  constructor(private _pizzaService: PizzaService, private _userService: UserService) {
  }

  _canEdit(pizzaDay: PizzaDay): boolean {
    return pizzaDay.owner._id === this._userService.getId() || this._userService.isAdmin();
  }

  _formatPhone(phone: string): string {
    return phone.replace(/(\d{2})/g, '$1 ').slice(0, -1);
  }

  _formatUser(user: User, owner: User, last: boolean) {
    const formattedUser = user.firstName + ' ' + user.lastName;
    return (user._id === owner._id ? '<strong>' + formattedUser + '</strong>' : formattedUser) + (!last ? ',' : '');
  }

  _isAdmin(): boolean {
    return this._userService.isAdmin();
  }

  isStepPassed(day: number, time: string): boolean {
    const now = new Date();
    const stepDate = new Date();

    stepDate.setHours(parseInt(time.substr(0, 2), 10), parseInt(time.substr(3, 2), 10), 0, 0);

    return day === now.getDay() && now.getTime() >= stepDate.getTime();
  }

  _isTherePizzaDay(): boolean {
    return Array.isArray(this._pizzaDays) && this._pizzaDays.length > 0;
  }

  ngOnInit() {
    Log.debug('PizzaDayListComponent->ngOnInit()');

    Log.debug('PizzaDayListComponent->ngOnInit: retrieve pizza days');

    this._pizzaService
      .getPizzaDays()
      .subscribe((pizzaDays: any) => {
        Log.debug('PizzaDayListComponent->ngOnInit: pizza days retrieved');

        this._pizzaDays = pizzaDays;

        if (!this._isTherePizzaDay()) {
          this.alerts.add({
            type: 'info',
            dismissible: false,
            message: 'No pizza day'
          });
        }

        this._loading = false;

      }, error => {
        Log.debug('PizzaDayListComponent->ngOnInit: impossible to retrieve pizza days: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._loading = false;
      });
  }
}
