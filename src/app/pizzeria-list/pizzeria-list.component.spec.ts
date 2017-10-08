import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzeriaListComponent } from './pizzeria-list.component';

describe('PizzeriaListComponent', () => {
  let component: PizzeriaListComponent;
  let fixture: ComponentFixture<PizzeriaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PizzeriaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PizzeriaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
