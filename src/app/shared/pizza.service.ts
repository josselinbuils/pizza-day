import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from './data.service';
import { Log } from './log.service';

@Injectable()
export class PizzaService {

  constructor(private _dataService: DataService) {
  }

  addPizzeria(pizzeria: any): Observable<any> {
    Log.debug('PizzaService->addPizzeria()');
    return this._dataService.post('/api/pizzeria', true, pizzeria);
  }

  createPizzaDay(pizzaDay: any): Observable<any> {
    Log.debug('PizzaService->createPizzaDay()');
    return this._dataService.post('/api/pizzaDay', true, pizzaDay);
  }

  deletePizzaDay(id: string): Observable<any> {
    Log.debug('PizzaService->deletePizzaDay()');
    return this._dataService.del('/api/pizzaDay/' + id);
  }

  deletePizzeria(id: string): Observable<any> {
    Log.debug('PizzaService->deletePizzeria()');
    return this._dataService.del('/api/pizzeria/' + id);
  }

  editPizzaDay(id: string, pizzaDay: any): Observable<any> {
    Log.debug('PizzaService->editPizzeria()');
    return this._dataService.patch('/api/pizzaDay/' + id, true, pizzaDay);
  }

  editPizzeria(id: string, pizzeria: any): Observable<any> {
    Log.debug('PizzaService->editPizzeria()');
    return this._dataService.patch('/api/pizzeria/' + id, true, pizzeria);
  }

  getPizzaDay(id: string): Observable<any> {
    Log.debug('PizzaService->getPizzaDay()');
    return this._dataService.get('/api/pizzaDay/' + id);
  }

  getPizzaDays(): Observable<any> {
    Log.debug('PizzaService->getPizzaDays()');
    return this._dataService.get('/api/pizzaDays');
  }

  getPizzerias(): Observable<any> {
    Log.debug('PizzaService->getPizzerias()');
    return this._dataService.get('/api/pizzerias');
  }

  getPizzeria(id: string): Observable<any> {
    Log.debug('PizzaService->getPizzeria()');
    return this._dataService.get('/api/pizzeria/' + id);
  }

  orderPizza(orderId: string, order: any): Observable<any> {
    Log.debug('PizzaService->orderPizza()');
    return this._dataService.post('/api/order/' + orderId, true, order);
  }
}
