import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccounthubComponent } from './accounthub.component';

describe('AccounthubComponent', () => {
  let component: AccounthubComponent;
  let fixture: ComponentFixture<AccounthubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccounthubComponent]
    });
    fixture = TestBed.createComponent(AccounthubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
