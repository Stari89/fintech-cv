import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(ThemeService);
    document = TestBed.inject(DOCUMENT);
  });

  it('should default to light theme', () => {
    expect(service.isDark()).toBe(false);
  });

  it('should toggle to dark and add .dark class to body', () => {
    service.toggle();
    expect(service.isDark()).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('should toggle back to light and remove .dark class', () => {
    service.toggle(); // dark
    service.toggle(); // light
    expect(service.isDark()).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('should persist theme to localStorage', () => {
    service.toggle();
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
