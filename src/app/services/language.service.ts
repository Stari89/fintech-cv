import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';

type Lang = 'en' | 'sl';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _lang = signal<Lang>('en');

  readonly lang = this._lang.asReadonly();

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('lang');
    const validLang: Lang | null = (saved === 'en' || saved === 'sl') ? saved : null;
    const browserLang: Lang = navigator.language.startsWith('sl') ? 'sl' : 'en';
    this.applyLang(validLang ?? browserLang);
  }

  toggle(): void {
    this.applyLang(this._lang() === 'en' ? 'sl' : 'en');
  }

  private applyLang(lang: Lang): void {
    this._lang.set(lang);
    this.transloco.setActiveLang(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
  }
}
