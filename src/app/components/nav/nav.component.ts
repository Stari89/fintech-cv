import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly language = inject(LanguageService);
}
