import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPizzeriaComponent } from './add-pizzeria.component';

describe('AddPizzeriaComponent', () => {
  let component: AddPizzeriaComponent;
  let fixture: ComponentFixture<AddPizzeriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPizzeriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPizzeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
