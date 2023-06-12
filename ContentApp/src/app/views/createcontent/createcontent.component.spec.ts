import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContentComponent } from './createcontent.component';

describe('CreatecontentComponent', () => {
  let component: CreateContentComponent;
  let fixture: ComponentFixture<CreateContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateContentComponent]
    });
    fixture = TestBed.createComponent(CreateContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
