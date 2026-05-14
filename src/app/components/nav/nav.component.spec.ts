import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { NavComponent } from './nav.component';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { TranslocoModule, TranslocoService, provideTransloco } from '@jsverse/transloco';

describe('NavComponent', () => {
  let fixture: ComponentFixture<NavComponent>;
  let compiled: HTMLElement;

  const themeService = { isDark: signal(false), toggle: vi.fn() };
  const langService  = { lang: signal('en'), toggle: vi.fn() };

  beforeEach(async () => {
    const mockTranslocoService = {
      translate: vi.fn((key: string) => key),
      selectTranslate: vi.fn((key: string) => {
        return {
          pipe: vi.fn(() => {
            const mockObservable = { subscribe: vi.fn() };
            return mockObservable;
          })
        };
      }),
      langChanges$: { pipe: vi.fn(() => ({ subscribe: vi.fn() })) },
      getActiveLang: vi.fn(() => 'en'),
      setActiveLang: vi.fn(),
      events$: { pipe: vi.fn(() => ({ subscribe: vi.fn() })) },
      _isLangScoped: false,
      _isMissingKeyLogged: false,
      config: {
        reRenderOnLangChange: true
      }
    };

    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [
        { provide: ThemeService, useValue: themeService },
        { provide: LanguageService, useValue: langService },
        { provide: TranslocoService, useValue: mockTranslocoService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should render the site logo mark', () => {
    expect(compiled.querySelector('[data-testid="nav-logo"]')).toBeTruthy();
  });

  it('should render a theme toggle button', () => {
    expect(compiled.querySelector('[data-testid="theme-toggle"]')).toBeTruthy();
  });

  it('should render a language toggle button', () => {
    expect(compiled.querySelector('[data-testid="lang-toggle"]')).toBeTruthy();
  });

  it('should call ThemeService.toggle when theme button is clicked', () => {
    compiled.querySelector<HTMLElement>('[data-testid="theme-toggle"]')!.click();
    expect(themeService.toggle).toHaveBeenCalled();
  });

  it('should call LanguageService.toggle when lang button is clicked', () => {
    compiled.querySelector<HTMLElement>('[data-testid="lang-toggle"]')!.click();
    expect(langService.toggle).toHaveBeenCalled();
  });
});
