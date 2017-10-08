import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { constants } from '../shared/constants';
import { Log } from '../shared/log.service';
import { PizzaDay } from '../shared/pizza-day';
import { PizzaService } from '../shared/pizza.service';

@Component({
  moduleId: module.id,
  selector: 'app-order-pizza',
  templateUrl: 'order-pizza.component.html',
  styleUrls: ['order-pizza.component.css']
})

export class OrderPizzaComponent implements OnInit {

  @ViewChild(<any>AlertsComponent) alerts: AlertsComponent;

  _loading = true;
  _orderPizzaForm: FormGroup;
  _pizzaDay: PizzaDay;

  private _params: Params;
  private _submitEnabled = true;

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _router: Router,
              private _pizzaService: PizzaService) {
    this._route.params.subscribe(params => this._params = params);
  }

  _orderPizza(event: any) {
    Log.debug('OrderPizzaComponent->_orderPizza()');

    this._pizzaService
      .orderPizza(this._params['orderId'], this._orderPizzaForm.value)
      .subscribe(() => {
        Log.debug('OrderPizzaComponent->_orderPizza: success');

        this.alerts.add({
          type: 'success',
          message: 'Pizza successfully ordered',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS_MOVE,
          close: () => this._router.navigate(['dashboard'])
        });

      }, error => {
        Log.debug('OrderPizzaComponent->_orderPizza: error: ' + error.toLowerCase());

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

  _updatePizza(event: any) {
    (<FormControl> this._orderPizzaForm.controls['pizza']).setValue(event.target.value);
  }

  ngOnInit() {
    Log.debug('OrderPizzaComponent->ngOnInit()');

    this._orderPizzaForm = this._formBuilder.group({
      notes: [''],
      pizza: ['none', Validators.required]
    });

    Log.debug('OrderPizzaComponent->ngOnInit: retrieve pizza day');

    this._pizzaService
      .getPizzaDay(this._params['pizzaDayId'])
      .subscribe((pizzaDay: any) => {
        Log.debug('OrderPizzaComponent->ngOnInit: pizza day retrieved');

        this._pizzaDay = pizzaDay;
        this._loading = false;

      }, error => {
        Log.debug('OrderPizzaComponent->ngOnInit: impossible to retrieve pizza day: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error,
          close: () => this._router.navigate(['dashboard'])
        });

        this._loading = false;
      });
  }
}
