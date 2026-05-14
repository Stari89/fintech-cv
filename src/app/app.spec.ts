import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { App } from './app';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: TranslocoService,
          useValue: {
            setActiveLang: vi.fn()
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render router outlet', () => {
    const fixture = TestBed.createComponent(App);
    const compiled = fixture.nativeElement as HTMLElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
