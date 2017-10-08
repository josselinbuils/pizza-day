import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPizzaDayComponent } from './edit-pizza-day.component';

describe('EditPizzaDayComponent', () => {
  let component: EditPizzaDayComponent;
  let fixture: ComponentFixture<EditPizzaDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPizzaDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPizzaDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
