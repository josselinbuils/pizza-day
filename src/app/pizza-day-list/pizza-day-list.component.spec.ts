import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaDayListComponent } from './pizza-day-list.component';

describe('PizzaDayListComponent', () => {
  let component: PizzaDayListComponent;
  let fixture: ComponentFixture<PizzaDayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PizzaDayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PizzaDayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
