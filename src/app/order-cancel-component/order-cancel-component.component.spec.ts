import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCancelComponentComponent } from './order-cancel-component.component';

describe('OrderCancelComponentComponent', () => {
  let component: OrderCancelComponentComponent;
  let fixture: ComponentFixture<OrderCancelComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderCancelComponentComponent]
    });
    fixture = TestBed.createComponent(OrderCancelComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
