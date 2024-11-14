import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-level-display',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './level-display.component.html',
  styleUrl: './level-display.component.scss',
})
export class LevelDisplayComponent {
  public currentLevel = input.required<number>();
  public maxLevel = input<number>(0);
}
