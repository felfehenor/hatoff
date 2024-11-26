import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getEntry, isResearchComplete } from '../helpers';
import { GameResearch } from '../interfaces';

export const requireResearchGuard: (r: string) => CanActivateFn =
  (researchName: string) => () => {
    const router = inject(Router);

    const researchEntry = getEntry<GameResearch>(researchName);
    if (researchEntry && isResearchComplete(researchEntry.id)) {
      return true;
    }

    router.navigate(['/game/town']);
    return false;
  };
