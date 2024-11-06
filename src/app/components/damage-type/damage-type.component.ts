import { DecimalPipe } from '@angular/common';
import { Component, computed, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { allUnlockedDamageTypes } from '../../helpers';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-damage-type',
  standalone: true,
  imports: [DecimalPipe, ContentNameComponent, FormsModule],
  templateUrl: './damage-type.component.html',
  styleUrl: './damage-type.component.scss',
})
export class DamageTypeComponent {
  public id = model.required<string>();
  public damage = input.required<number>();

  public editable = input<boolean>(false);

  public isEditing = signal<boolean>(false);

  public unlockedDamageTypes = computed(() => allUnlockedDamageTypes());
}
