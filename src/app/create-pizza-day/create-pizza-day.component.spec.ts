import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePizzaDayComponent } from './create-pizza-day.component';

describe('CreatePizzaDayComponent', () => {
  let component: CreatePizzaDayComponent;
  let fixture: ComponentFixture<CreatePizzaDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePizzaDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePizzaDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
