import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface UserSettings {
  darkMode: boolean;
  itemsPerPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {}
  private initial: UserSettings = (() => {
    const saved = localStorage.getItem('userSettings');
    try {
      return saved ? JSON.parse(saved) : { darkMode: false, itemsPerPage: 10 };
    } catch {
      return { darkMode: false, itemsPerPage: 10 };
    }
  })();
  /**Could write this with signals:
 * private settings = signal<UserSettings>(this.initial);

  private persist = effect(() => {               //effect is function of signals, it runs when one or more signals it reads change
    localStorage.setItem('userSettings', JSON.stringify(this.settings()));
  });

updateSettings(newSettings: UserSettings) {
  this.settings.update(newSettings);
}

 */
  private settingSubject = new BehaviorSubject<UserSettings>(this.initial);
  settings$ = this.settingSubject.asObservable();

  update(newSetting: UserSettings) {
    this.settingSubject.next(newSetting);
    localStorage.setItem('userSettings', JSON.stringify(newSetting));
  }
}
