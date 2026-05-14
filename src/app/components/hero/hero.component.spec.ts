import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { HeroComponent } from './hero.component';
import { ContentService } from '../../services/content.service';
import { LanguageService } from '../../services/language.service';
import { TranslocoService } from '@jsverse/transloco';
import { CvContent } from '../../models/content.model';

const mockContent: CvContent = {
  meta: { name: 'Test User', title: { en: 'Engineer', sl: 'Inženir' }, email: '', phone: '' },
  about: { en: '', sl: '' }, experience: [], skills: [], education: [], projects: [], social: []
};

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;
  let compiled: HTMLElement;

  const contentService  = { content: signal(mockContent) };
  const langService     = { lang: signal('en') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [
        { provide: ContentService,  useValue: contentService },
        { provide: LanguageService, useValue: langService },
        {
          provide: TranslocoService,
          useValue: {
            translate: vi.fn((key: string) => key),
            selectTranslate: vi.fn((key: string) => of(key)),
            langChanges$: of('en'),
            getActiveLang: vi.fn(() => 'en'),
            setActiveLang: vi.fn(),
            events$: of({}),
            _isLangScoped: false,
            _isMissingKeyLogged: false,
            _loadDependencies: vi.fn(() => of(null)),
            config: { reRenderOnLangChange: true },
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should render the prompt line', () => {
    expect(compiled.querySelector('[data-testid="hero-prompt"]')).toBeTruthy();
  });

  it('should render the name', () => {
    expect(compiled.querySelector('[data-testid="hero-name"]')?.textContent).toContain('Test User');
  });

  it('should render the blinking cursor', () => {
    expect(compiled.querySelector('.cursor')).toBeTruthy();
  });

  it('should render the job title in the active language', () => {
    expect(compiled.querySelector('[data-testid="hero-title"]')?.textContent).toContain('Engineer');
  });
});
