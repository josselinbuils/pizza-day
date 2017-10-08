import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPizzeriaComponent } from './edit-pizzeria.component';

describe('EditPizzeriaComponent', () => {
  let component: EditPizzeriaComponent;
  let fixture: ComponentFixture<EditPizzeriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPizzeriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPizzeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
