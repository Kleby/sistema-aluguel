import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoupaListComponent } from './roupa-list.component';

describe('RoupaListComponent', () => {
  let component: RoupaListComponent;
  let fixture: ComponentFixture<RoupaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoupaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoupaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
