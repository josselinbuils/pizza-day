import { Component, Input, OnChanges } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-loading',
  templateUrl: 'loading.component.html',
  styleUrls: ['loading.component.css']
})

export class LoadingComponent implements OnChanges {

  @Input() display = false;

  show = false;

  private showTimeout: any;

  ngOnChanges() {
    if (this.display) {
      this.showTimeout = setTimeout(() => this.show = true, 50);
    } else if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.show = false;
    }
  }
}
