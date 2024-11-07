import { Component } from '@angular/core';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { ResearchListComponent } from '../../components/research-list/research-list.component';

@Component({
  selector: 'app-game-research',
  standalone: true,
  imports: [PageCardComponent, ResearchListComponent],
  templateUrl: './game-research.component.html',
  styleUrl: './game-research.component.scss',
})
export class GameResearchComponent {}
