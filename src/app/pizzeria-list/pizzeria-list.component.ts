import { Component, OnInit, ViewChild } from '@angular/core';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { Log } from '../shared/log.service';
import { PizzaService } from '../shared/pizza.service';
import { Pizzeria } from '../shared/pizzeria';
import { UserService } from '../shared/user.service';

@Component({
  moduleId: module.id,
  selector: 'app-pizzeria-list',
  templateUrl: 'pizzeria-list.component.html',
  styleUrls: ['pizzeria-list.component.css']
})

export class PizzeriaListComponent implements OnInit {

  @ViewChild(AlertsComponent) alerts: AlertsComponent;

  _loading = true;
  _pizzerias: Pizzeria[] = [];

  constructor(private _pizzaService: PizzaService, private _userService: UserService) {
  }

  _canCreate(): boolean {
    return this._userService.isAdmin();
  }

  _canEdit(): boolean {
    return this._userService.isAdmin();
  }

  _formatPhone(phone: string): string {
    return phone.replace(/(\d{2})/g, '$1 ').slice(0, -1);
  }

  _isTherePizzeria(): boolean {
    return Array.isArray(this._pizzerias) && this._pizzerias.length > 0;
  }

  ngOnInit() {
    Log.debug('PizzeriaListComponent->ngOnInit()');

    Log.debug('PizzeriaListComponent->ngOnInit: retrieve pizzerias');

    this._pizzaService
      .getPizzerias()
      .subscribe((pizzerias: any) => {
        Log.debug('PizzeriaListComponent->ngOnInit: pizzerias retrieved');

        this._pizzerias = pizzerias;

        if (!this._isTherePizzeria()) {
          this.alerts.add({
            type: 'info',
            dismissible: false,
            message: 'No pizzeria'
          });
        }

        this._loading = false;

      }, error => {
        Log.debug('PizzeriaListComponent->ngOnInit: impossible to retrieve pizzerias: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._loading = false;
      });
  }
}
