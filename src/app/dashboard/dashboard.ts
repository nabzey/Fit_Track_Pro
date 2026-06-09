import { Component, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Activity } from '../activity.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  private readonly platformId = inject(PLATFORM_ID);

  // Core Application State (using Signals)
  readonly activities = signal<Activity[]>([]);

  // Form Fields (bound via ngModel)
  activityName = '';
  activityType: 'SPORT' | 'HYDRATATION' = 'SPORT';
  activityValue: number | null = null;

  // Constants
  readonly dailyCalorieGoal = 2000;

  // Real-time computed values
  readonly totalCalories = computed(() => {
    return this.activities()
      .filter(a => a.type === 'SPORT')
      .reduce((sum, a) => sum + a.value, 0);
  });

  readonly totalWater = computed(() => {
    return this.activities()
      .filter(a => a.type === 'HYDRATATION')
      .reduce((sum, a) => sum + a.value, 0);
  });

  readonly remainingCalories = computed(() => {
    return this.dailyCalorieGoal - this.totalCalories();
  });

  // Health Alert Logic
  // - WARNING: Water < 1500 ml
  // - SUCCESS: Water >= 1500 ml AND Calories > 500 kcal
  // - INFO: Water >= 1500 ml AND Calories <= 500 kcal
  readonly healthStatus = computed<'WARNING' | 'SUCCESS' | 'INFO'>(() => {
    const water = this.totalWater();
    const calories = this.totalCalories();
    if (water < 1500) {
      return 'WARNING';
    } else if (calories > 500) {
      return 'SUCCESS';
    } else {
      return 'INFO';
    }
  });

  constructor() {
    // SSR safe retrieval from LocalStorage
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem('fit_track_activities');
        if (stored) {
          this.activities.set(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load activities from localStorage', e);
      }
    }

    // SSR safe autosave to LocalStorage
    effect(() => {
      const data = this.activities();
      if (isPlatformBrowser(this.platformId)) {
        try {
          localStorage.setItem('fit_track_activities', JSON.stringify(data));
        } catch (e) {
          console.error('Failed to save activities to localStorage', e);
        }
      }
    });
  }

  addActivity() {
    const name = this.activityName.trim();
    const type = this.activityType;
    const value = this.activityValue;

    if (!name) {
      alert('Veuillez saisir un nom pour l\'activité.');
      return;
    }

    if (value === null || value <= 0) {
      const unit = type === 'SPORT' ? 'calories' : 'ml';
      alert(`Veuillez entrer une valeur positive pour les ${unit}.`);
      return;
    }

    const newActivity: Activity = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name,
      type,
      value,
      createdAt: Date.now()
    };

    // Update state signal
    this.activities.update(prev => [...prev, newActivity]);

    // Reset Form Fields
    this.activityName = '';
    this.activityValue = null;
  }

  deleteActivity(id: string) {
    this.activities.update(prev => prev.filter(a => a.id !== id));
  }

  loadDemoData() {
    const now = Date.now();
    const demo: Activity[] = [
      { id: 'demo-1', name: 'Séance de Fitness', type: 'SPORT', value: 350, createdAt: now - 3600000 * 3 },
      { id: 'demo-2', name: 'Grand verre d\'eau', type: 'HYDRATATION', value: 400, createdAt: now - 3600000 * 2 },
      { id: 'demo-3', name: 'Bouteille d\'eau midi', type: 'HYDRATATION', value: 800, createdAt: now - 3600000 * 1 }
    ];
    this.activities.set(demo);
  }

  clearAll() {
    if (confirm('Voulez-vous vraiment vider tout le journal d\'aujourd\'hui ?')) {
      this.activities.set([]);
    }
  }
}
