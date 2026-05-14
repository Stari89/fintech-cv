import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _isDark = signal<boolean>(false);

  readonly isDark = this._isDark.asReadonly();

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
    this.applyTheme(saved ? saved === 'dark' : prefersDark);
  }

  toggle(): void {
    this.applyTheme(!this._isDark());
  }

  private applyTheme(isDark: boolean): void {
    this._isDark.set(isDark);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      this.document.body.classList.toggle('dark', isDark);
    }
  }
}
