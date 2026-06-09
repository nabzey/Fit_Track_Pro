import { TestBed } from '@angular/core/testing';
import { App, Activity } from './app';

describe('App Component (Fit Track Pro)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should calculate totals and health alerts correctly based on activities', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    // Initially all totals should be 0 and health status is WARNING (Water < 1500)
    expect(app.totalCalories()).toBe(0);
    expect(app.totalWater()).toBe(0);
    expect(app.remainingCalories()).toBe(2000);
    expect(app.healthStatus()).toBe('WARNING');

    // Add a sport activity
    app.activities.set([
      { id: '1', name: 'Running', type: 'SPORT', value: 300, createdAt: Date.now() }
    ]);
    expect(app.totalCalories()).toBe(300);
    expect(app.remainingCalories()).toBe(1700);
    expect(app.healthStatus()).toBe('WARNING'); // Still warning since water is 0

    // Add hydration below threshold
    app.activities.update(current => [
      ...current,
      { id: '2', name: 'Eau 1', type: 'HYDRATATION', value: 1000, createdAt: Date.now() }
    ]);
    expect(app.totalWater()).toBe(1000);
    expect(app.healthStatus()).toBe('WARNING'); // Water < 1500 ml

    // Add hydration above threshold, but sport is still <= 500 kcal
    app.activities.update(current => [
      ...current,
      { id: '3', name: 'Eau 2', type: 'HYDRATATION', value: 600, createdAt: Date.now() }
    ]);
    expect(app.totalWater()).toBe(1600); // >= 1500 ml
    expect(app.healthStatus()).toBe('INFO'); // Water >= 1500 but Sport <= 500

    // Add sport activity to cross 500 kcal limit
    app.activities.update(current => [
      ...current,
      { id: '4', name: 'Gym', type: 'SPORT', value: 300, createdAt: Date.now() }
    ]);
    expect(app.totalCalories()).toBe(600); // > 500 kcal
    expect(app.healthStatus()).toBe('SUCCESS'); // Water >= 1500 AND Sport > 500
  });

  it('should add activity through addActivity() method', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.activityName = 'Pilates';
    app.activityType = 'SPORT';
    app.activityValue = 250;

    app.addActivity();

    const list = app.activities();
    expect(list.length).toBe(1);
    expect(list[0].name).toBe('Pilates');
    expect(list[0].type).toBe('SPORT');
    expect(list[0].value).toBe(250);
  });
});
