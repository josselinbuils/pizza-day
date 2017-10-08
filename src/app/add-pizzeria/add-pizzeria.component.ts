import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { constants } from '../shared/constants';
import { CustomValidators } from '../shared/custom-validators';
import { Log } from '../shared/log.service';
import { PizzaService } from '../shared/pizza.service';

@Component({
  moduleId: module.id,
  selector: 'app-add-pizzeria',
  templateUrl: 'add-pizzeria.component.html',
  styleUrls: ['add-pizzeria.component.css']
})

export class AddPizzeriaComponent implements OnInit {

  @ViewChild(AlertsComponent) alerts: AlertsComponent;

  _addPizzeriaForm: FormGroup;
  _constants = constants;
  _submitEnabled = true;

  constructor(private _formBuilder: FormBuilder, private _router: Router, private _pizzaService: PizzaService) {
  }

  _addPizzeria(event: any) {
    Log.debug('AddPizzeriaComponent->_addPizzeria()');

    this._pizzaService
      .addPizzeria(this._addPizzeriaForm.value)
      .subscribe((pizzeria: any) => {
        Log.debug('AddPizzeriaComponent->_addPizzeria: success');

        this.alerts.add({
          type: 'success',
          message: 'Pizzeria successfully added',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS_MOVE,
          close: () => this._router.navigate(['editPizzeria', pizzeria._id, {showPizzasTab: true}])
        });

      }, error => {
        Log.debug('AddPizzeriaComponent->_addPizzeria: error: ' + error.toLowerCase());

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
    Log.debug('AddPizzeriaComponent->ngOnInit()');

    this._addPizzeriaForm = this._formBuilder.group({
      address: [''],
      name: ['', Validators.required],
      phone: ['', Validators.compose([Validators.required, CustomValidators.phone])]
    });
  }
}
