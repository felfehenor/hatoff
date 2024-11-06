import { Component } from '@angular/core';
import { PageCardComponent } from '../../components/page-card/page-card.component';

@Component({
  selector: 'app-game-recruit',
  standalone: true,
  imports: [PageCardComponent],
  templateUrl: './game-recruit.component.html',
  styleUrl: './game-recruit.component.scss',
})
export class GameRecruitComponent {}
