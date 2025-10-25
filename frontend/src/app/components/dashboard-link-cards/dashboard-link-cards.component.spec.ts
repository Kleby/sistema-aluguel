import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLinkCardsComponent } from './dashboard-link-cards.component';

describe('DashboardLinkCardsComponent', () => {
  let component: DashboardLinkCardsComponent;
  let fixture: ComponentFixture<DashboardLinkCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLinkCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLinkCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
