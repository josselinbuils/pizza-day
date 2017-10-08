import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AlertsComponent } from '../shared/alerts/alerts.component';
import { constants } from '../shared/constants';
import { CustomValidators } from '../shared/custom-validators';
import { Log } from '../shared/log.service';
import { Pizza } from '../shared/pizza';
import { PizzaService } from '../shared/pizza.service';
import { Pizzeria } from '../shared/pizzeria';

@Component({
  moduleId: module.id,
  selector: 'app-edit-pizzeria',
  templateUrl: 'edit-pizzeria.component.html',
  styleUrls: ['edit-pizzeria.component.css']
})

export class EditPizzeriaComponent implements OnInit {
  @ViewChild(AlertsComponent) alerts: AlertsComponent;

  _constants = constants;
  _loading = true;
  _pizzeria: Pizzeria;

  _deletePizzeriaSubmitEnabled = true;

  _editInfoForm: FormGroup;
  _editInfoSubmitEnabled = true;

  _editPizzasForm: FormArray;
  _editPizzasSubmitEnabled = true;

  _params: Params;

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _router: Router,
              private _pizzaService: PizzaService) {
    this._route.params.subscribe(params => this._params = params);
  }

  _addPizza(event: any): void {
    Log.debug('EditPizzeriaComponent->_addPizza()');

    this._editPizzasForm.push(this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required]
    }));

    event.preventDefault();
  }

  _deletePizza(index: any, event: any): void {
    Log.debug('EditPizzeriaComponent->_deletePizza()');

    this._editPizzasForm.removeAt(index);

    event.preventDefault();
  }

  _deletePizzeria(): void {
    Log.debug('EditPizzeriaComponent->_deletePizzeria()');

    this._pizzaService
      .deletePizzeria(this._pizzeria._id)
      .subscribe(() => {
        Log.debug('EditPizzeriaComponent->_deletePizzeria: success');

        this.alerts.add({
          type: 'success',
          message: 'Pizzeria successfully deleted',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS_MOVE,
          close: () => this._router.navigate(['dashboard'])
        });

      }, error => {
        Log.debug('EditPizzeriaComponent->_deletePizzeria: error: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._deletePizzeriaSubmitEnabled = true;
      });

    this.alerts.clear();
    this._deletePizzeriaSubmitEnabled = false;
  }

  _editInfo(event: any): void {
    Log.debug('EditPizzeriaComponent->editInfo()');

    this._pizzaService
      .editPizzeria(this._pizzeria._id, this._editInfoForm.value)
      .subscribe(() => {
        Log.debug('EditPizzeriaComponent->editInfo: success');

        this.alerts.add({
          type: 'success',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS,
          message: 'Info successfully edited'
        });

        this._editInfoSubmitEnabled = true;

      }, error => {
        Log.debug('EditPizzeriaComponent->editInfo: error: ' + error.toLowerCase());

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

  _editPizzas(event: any): void {
    Log.debug('EditPizzeriaComponent->_editPizzas()');

    this._pizzaService
      .editPizzeria(this._pizzeria._id, {pizzas: this._editPizzasForm.value})
      .subscribe(() => {
        Log.debug('EditPizzeriaComponent->_editPizzas: success');

        this.alerts.add({
          type: 'success',
          dismissDelay: constants.DISMISS_DELAY_SUCCESS,
          message: 'Pizzas successfully edited'
        });

        this._editPizzasSubmitEnabled = true;

      }, error => {
        Log.debug('EditPizzeriaComponent->_editPizzas: error: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._editPizzasSubmitEnabled = true;
      });


    this.alerts.clear();
    this._editPizzasSubmitEnabled = false;

    event.preventDefault();
  }

  ngOnInit() {
    Log.debug('AddPizzeriaComponent->ngOnInit()');

    Log.debug('EditPizzeriaComponent->ngOnInit: retrieve pizzeria');

    this._pizzaService
      .getPizzeria(this._params['id'])
      .subscribe((pizzeria: any) => {
        Log.debug('EditPizzeriaComponent->ngOnInit: pizzeria retrieved');

        this._pizzeria = pizzeria;

        this._editInfoForm = this._formBuilder.group({
          address: [pizzeria.address],
          name: [pizzeria.name, Validators.required],
          phone: [pizzeria.phone, Validators.compose([Validators.required, CustomValidators.phone])]
        });

        this._editPizzasForm = new FormArray([]);

        const pizzas: Pizza[] = this._pizzeria.pizzas;

        pizzas.forEach((pizza: any) => {
          this._editPizzasForm.push(this._formBuilder.group({
            _id: [pizza._id, Validators.required],
            name: [pizza.name, Validators.required],
            description: [pizza.description, Validators.required],
            price: [pizza.price, Validators.required]
          }));
        });

        this._loading = false;

      }, error => {
        Log.debug('EditPizzeriaComponent->ngOnInit: impossible to retrieve pizzeria: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error,
          close: () => this._router.navigate(['dashboard'])
        });

        this._loading = false;
      });
  }
}
