import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-art',
  standalone: true,
  imports: [],
  templateUrl: './hero-art.component.html',
  styleUrl: './hero-art.component.scss',
})
export class HeroArtComponent {
  public id = input.required<string>();
}
