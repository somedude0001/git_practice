import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = false;

  setDarkMode(enabled: boolean): void {
    this.darkMode = enabled;

    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  getDarkMode(): boolean {
    return this.darkMode;
  }
}

/** We can write this service with signals (experimental, I don't know if it's correct or not ):
 * private darkMode = signal(false);
 * setDarkMode(enabled : boolean) : void {
 * this.darkMode.set(enabled)
 * document.body.classList.toggle('dark-mode', enabled);
 * }
 * getDarkMode(): boolean {
 * return this.darkMode(); //returns the current value for comps to use, it's not reactive
 * }
 *darkMode$ = this.darkMode; //exposing signals for comps to use, it is reactive
 */
