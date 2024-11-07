import { Component } from '@angular/core';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';

@Component({
  selector: 'app-game-town',
  standalone: true,
  imports: [PageCardComponent, TaskListComponent],
  templateUrl: './game-town.component.html',
  styleUrl: './game-town.component.scss',
})
export class GameTownComponent {}
