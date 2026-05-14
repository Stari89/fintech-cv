import { Component } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { HeroComponent } from '../../components/hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, HeroComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {}
