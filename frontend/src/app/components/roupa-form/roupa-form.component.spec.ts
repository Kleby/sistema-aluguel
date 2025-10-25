import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoupaFormComponent } from './roupa-form.component';

describe('RoupaFormComponent', () => {
  let component: RoupaFormComponent;
  let fixture: ComponentFixture<RoupaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoupaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoupaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
