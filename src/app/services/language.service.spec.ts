import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from './language.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LanguageService', () => {
  let service: LanguageService;
  let translocoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: TranslocoService,
          useValue: {
            setActiveLang: vi.fn()
          }
        }
      ]
    });
    service = TestBed.inject(LanguageService);
    const translocoService = TestBed.inject(TranslocoService);
    translocoSpy = translocoService.setActiveLang as any;
  });

  it('should default to "en"', () => {
    expect(service.lang()).toBe('en');
  });

  it('should toggle from en to sl', () => {
    service.toggle();
    expect(service.lang()).toBe('sl');
  });

  it('should toggle back from sl to en', () => {
    service.toggle(); // sl
    service.toggle(); // en
    expect(service.lang()).toBe('en');
  });

  it('should call TranslocoService.setActiveLang on toggle', () => {
    service.toggle();
    expect(translocoSpy).toHaveBeenCalledWith('sl');
  });

  it('should persist language to localStorage', () => {
    service.toggle();
    expect(localStorage.getItem('lang')).toBe('sl');
  });

  it('should apply saved language from localStorage on init', () => {
    localStorage.setItem('lang', 'sl');
    service.init();
    expect(service.lang()).toBe('sl');
    expect(translocoSpy).toHaveBeenCalledWith('sl');
  });

  it('should fall back to "en" for non-Slovenian browser language on init', () => {
    service.init(); // no localStorage, navigator.language defaults to en-US in test env
    expect(service.lang()).toBe('en');
  });

  it('should ignore invalid localStorage values and use browser language', () => {
    localStorage.setItem('lang', 'fr'); // invalid
    service.init();
    // 'fr' is invalid so falls back to browser lang (en in test env)
    expect(service.lang()).toBe('en');
  });

  it('should do nothing on server platform', () => {
    TestBed.resetTestingModule();
    translocoSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: TranslocoService, useValue: { setActiveLang: translocoSpy } }
      ]
    });
    const serverService = TestBed.inject(LanguageService);
    expect(() => serverService.init()).not.toThrow();
    expect(serverService.lang()).toBe('en');
  });
});

