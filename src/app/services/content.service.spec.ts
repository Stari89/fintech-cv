import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { vi } from 'vitest';
import { ContentService } from './content.service';
import { CvContent } from '../models/content.model';

const mockContent: CvContent = {
  meta: { name: 'Test User', title: { en: 'Engineer', sl: 'Inženir' }, email: 'a@b.com', phone: '123' },
  about: { en: 'About EN', sl: 'About SL' },
  experience: [], skills: [], education: [], projects: [], social: []
};

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should have null content before load', () => {
    expect(service.content()).toBeNull();
  });

  it('should set content signal after load()', () => {
    service.load();
    const req = httpMock.expectOne('/api/content');
    expect(req.request.method).toBe('GET');
    req.flush(mockContent);
    expect(service.content()).toEqual(mockContent);
  });

  it('should keep content null and log error when API fails', () => {
    const spy = vi.spyOn(console, 'error');
    service.load();
    const req = httpMock.expectOne('/api/content');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    expect(service.content()).toBeNull();
    expect(spy).toHaveBeenCalled();
  });

  it('should keep content null on 404', () => {
    const spy = vi.spyOn(console, 'error');
    service.load();
    const req = httpMock.expectOne('/api/content');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
    expect(service.content()).toBeNull();
  });
});
