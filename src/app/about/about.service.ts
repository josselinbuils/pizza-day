import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../shared/data.service';
import { Log } from '../shared/log.service';

@Injectable()
export class AboutService {

  constructor(private _dataService: DataService) {
  }

  getDependencies(): Observable<any> {
    Log.debug('AboutService->getDependencies()');
    return this._dataService.get('/api/dependencies');
  }

  getGitHubProfile(): Observable<any> {
    Log.debug('AboutService->getGitHubProfile()');
    return this._dataService.get('https://api.github.com/users/josselinbuils');
  }
}
