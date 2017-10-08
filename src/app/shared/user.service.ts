import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Observable';

import { DataService } from './data.service';
import { Log } from './log.service';
import { User } from './user';

@Injectable()
export class UserService {

  private _logged = false;
  private _user: User;

  constructor(private _router: Router, private _dataService: DataService) {
  }

  checkIfLogged(): Observable<any> {
    Log.debug('UserService->checkIfLogged()');

    return Observable.create((observer: any) => {
      this._dataService
        .get('/logged')
        .subscribe((res: any) => {

          this._logged = res.logged;

          if (this._logged) {
            this._user = <User> res.user;
          }

          observer.next(this._logged);

        }, error => {
          Log.debug('UserService->checkIfLogged: error: ' + error.toLowerCase());

          observer.error(error);
        });
    });
  }

  createAccount(user: any): Observable<any> {
    Log.debug('UserService->createAccount()');

    return Observable.create((observer: any) => {
      this._dataService
        .post('/api/user', true, user)
        .subscribe((newUser: any) => {
          Log.debug('UserService->createAccount: success');

          this._user = newUser;
          this._logged = false;
          observer.next();

        }, error => {
          Log.debug('UserService->createAccount: error: ' + error.toLowerCase());
          observer.error(error);
        });
    });
  }

  deleteAccount(id: string): Observable<any> {
    Log.debug('UserService->deleteAccount()');
    return this._dataService.del('/api/user/' + id);
  }

  editAccount(id: any, user: any): Observable<any> {
    Log.debug('UserService->editAccount()');

    return Observable.create((observer: any) => {
      this._dataService
        .patch('/api/user/' + id, true, user)
        .subscribe((editedUser: any) => {
          Log.debug('UserService->editAccount: success');

          this._user = editedUser;
          observer.next();

        }, error => {
          Log.debug('UserService->editAccount: error: ' + error.toLowerCase());
          observer.error(error);
        });
    });
  }

  getFullName(): string {
    return this._user ? this._user.firstName + ' ' + this._user.lastName : '';
  }

  getId(): string {
    return this._user ? this._user._id : '';
  }

  getUser(id: any): Observable<any> {
    Log.debug('UserService->getUser()');
    return this._dataService.get('/api/user/' + id);
  }

  getUsers(): Observable<any> {
    Log.debug('UserService->getUsers()');
    return this._dataService.get('/api/users');
  }

  isAdmin(): boolean {
    return this._user && this._user.admin;
  }

  isLogged(): boolean {
    return this._logged;
  }

  login(credentials: any): Observable<any> {
    Log.debug('UserService->login()');

    return Observable.create((observer: any) => {
      this._dataService
        .post('/login', false, credentials)
        .subscribe((user: any) => {
          Log.debug('UserService->login: success');

          this._user = user;
          this._logged = true;
          observer.next({logged: true});

        }, error => {
          Log.debug('UserService->login: error: ' + error.toLowerCase());

          this._logged = false;
          observer.error(error);
        });
    });
  }

  logout(): void {
    Log.debug('UserService->logout()');

    this._dataService
      .get('/logout')
      .subscribe(() => {
        Log.debug('UserService->logout: success');

        this.userNotLogged();
        this._router.navigate(['Login']);

      }, error => {
        Log.debug('UserService->logout: error: ' + error.toLowerCase());
      });
  }

  userNotLogged(): void {
    Log.debug('UserService->userNotLogged()');

    this._user = null;
    this._logged = false;
  }
}
