import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CvContent } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly _content = signal<CvContent | null>(null);

  readonly content = this._content.asReadonly();

  load(): void {
    this.http.get<CvContent>('/api/content').subscribe(data => {
      this._content.set(data);
    });
  }
}
