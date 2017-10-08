import { Component, OnInit, ViewChild } from '@angular/core';
import { AboutService } from './about.service';
import { AlertsComponent } from '../shared/alerts/alerts.component';
import { Log } from '../shared/log.service';

@Component({
  moduleId: module.id,
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css']
})

export class AboutComponent implements OnInit {

  @ViewChild(AlertsComponent) alerts: AlertsComponent;

  _dependencies: string[];
  _loadingDependencies = true;
  _loadingProfile = true;
  _profile: any;

  constructor(private _aboutService: AboutService) {
  }

  ngOnInit() {

    this._aboutService
      .getGitHubProfile()
      .subscribe(profile => {
        Log.debug('AboutComponent->ngOnInit: GitHub profile retrieved');

        this._profile = profile;
        this._loadingProfile = false;

      }, error => {
        Log.debug('AboutComponent->ngOnInit: impossible to retrieve GitHub profile: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._loadingProfile = false;
      });

    this._aboutService
      .getDependencies()
      .subscribe(dependencies => {
        Log.debug('AboutComponent->ngOnInit: dependencies retrieved');

        this._dependencies = dependencies;
        this._loadingDependencies = false;

      }, error => {
        Log.debug('AboutComponent->ngOnInit: impossible to retrieve dependencies: ' + error.toLowerCase());

        this.alerts.add({
          type: 'danger',
          message: error
        });

        this._loadingDependencies = false;
      });
  }
}
