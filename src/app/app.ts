import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';
import { ContentService } from './services/content.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: []
})
export class App implements OnInit {
  private readonly theme    = inject(ThemeService);
  private readonly language = inject(LanguageService);
  private readonly content  = inject(ContentService);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.theme.init();
    this.language.init();
    
    // Only load content on the client side (not during SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.content.load();
    }
  }
}
