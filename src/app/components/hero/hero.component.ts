import { Component, inject, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../services/content.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  private readonly content  = inject(ContentService);
  private readonly language = inject(LanguageService);

  protected readonly name = computed(() => this.content.content()?.meta.name ?? '');

  protected readonly title = computed(() => {
    const t = this.content.content()?.meta.title;
    return t ? t[this.language.lang()] : '';
  });
}
