import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard/dashboard';
import { Activity } from './activity.model';

describe('DashboardComponent (Fit Track Pro)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();
  });

  it('should create the dashboard component', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const dashboard = fixture.componentInstance;
    expect(dashboard).toBeTruthy();
  });

  it('should calculate totals and health alerts correctly based on activities', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const dashboard = fixture.componentInstance;

    // Initially all totals should be 0 and health status is WARNING (Water < 1500)
    expect(dashboard.totalCalories()).toBe(0);
    expect(dashboard.totalWater()).toBe(0);
    expect(dashboard.remainingCalories()).toBe(2000);
    expect(dashboard.healthStatus()).toBe('WARNING');

    // Add a sport activity
    dashboard.activities.set([
      { id: '1', name: 'Running', type: 'SPORT', value: 300, createdAt: Date.now() }
    ]);
    expect(dashboard.totalCalories()).toBe(300);
    expect(dashboard.remainingCalories()).toBe(1700);
    expect(dashboard.healthStatus()).toBe('WARNING'); // Still warning since water is 0

    // Add hydration below threshold
    dashboard.activities.update(current => [
      ...current,
      { id: '2', name: 'Eau 1', type: 'HYDRATATION', value: 1000, createdAt: Date.now() }
    ]);
    expect(dashboard.totalWater()).toBe(1000);
    expect(dashboard.healthStatus()).toBe('WARNING'); // Water < 1500 ml

    // Add hydration above threshold, but sport is still <= 500 kcal
    dashboard.activities.update(current => [
      ...current,
      { id: '3', name: 'Eau 2', type: 'HYDRATATION', value: 600, createdAt: Date.now() }
    ]);
    expect(dashboard.totalWater()).toBe(1600); // >= 1500 ml
    expect(dashboard.healthStatus()).toBe('INFO'); // Water >= 1500 but Sport <= 500

    // Add sport activity to cross 500 kcal limit
    dashboard.activities.update(current => [
      ...current,
      { id: '4', name: 'Gym', type: 'SPORT', value: 300, createdAt: Date.now() }
    ]);
    expect(dashboard.totalCalories()).toBe(600); // > 500 kcal
    expect(dashboard.healthStatus()).toBe('SUCCESS'); // Water >= 1500 AND Sport > 500
  });

  it('should add activity through addActivity() method', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const dashboard = fixture.componentInstance;

    dashboard.activityName = 'Pilates';
    dashboard.activityType = 'SPORT';
    dashboard.activityValue = 250;

    dashboard.addActivity();

    const list = dashboard.activities();
    expect(list.length).toBe(1);
    expect(list[0].name).toBe('Pilates');
    expect(list[0].type).toBe('SPORT');
    expect(list[0].value).toBe(250);
  });
});
