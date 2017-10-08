import { Component } from '@angular/core';

import { Log } from '../log.service';

@Component({
  moduleId: module.id,
  selector: 'app-alerts',
  templateUrl: 'alerts.component.html',
  styleUrls: ['alerts.component.css']
})

export class AlertsComponent {

  _icons: any = {
    danger: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
    success: 'fa-check-circle'
  };

  _alerts: Alert[] = [];

  add(alert: Alert): void {
    Log.debug('AlertsComponent->add()');

    alert.type = alert.type || 'info';
    alert.dismissible = alert.dismissible !== undefined ? alert.dismissible : true;

    if (Number.isInteger(alert.dismissDelay)) {
      const id = new Date().getTime();

      alert._id = id;

      setTimeout(() => {

        if (alert.close) {
          alert.close();
        }

        for (let i = 0; i < this._alerts.length; i++) {
          if (this._alerts[i]._id === id) {
            this._alerts.splice(i, 1);
            break;
          }
        }

      }, alert.dismissDelay);
    }

    this._alerts.push(alert);
  }

  clear(): void {
    Log.debug('AlertsComponent->clear()');
    this._alerts = [];
  }

  _close(i: number): void {
    Log.debug('AlertsComponent->_close()');

    const close: Function = this._alerts[i].close;

    if (close) {
      close();
    }

    this._alerts.splice(i, 1);
  }
}

interface Alert {
  _id?: number;
  close?: Function;
  dismissible?: boolean;
  dismissDelay?: number;
  message: string;
  type?: string;
}
