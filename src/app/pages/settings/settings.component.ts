import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { SettingsService } from '../../services/settings.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private theme: ThemeService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('userSettings');
    const parsed = saved ? JSON.parse(saved) : {};

    this.form = this.fb.group({
      darkMode: [parsed.darkMode ?? false],
      itemsPerPage: [parsed.itemsPerPage ?? 10],
    });
    this.theme.setDarkMode(this.form.value.darkMode);

    /** removed because of added service, I'll have to add update method to settingservice
    this.form.valueChanges.subscribe((value) => {
      localStorage.setItem('userSettings', JSON.stringify(value));
      this.theme.setDarkMode(value.darkMode);
    });
    */
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.settingsService.update(value);
      this.theme.setDarkMode(value.darkMode);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
