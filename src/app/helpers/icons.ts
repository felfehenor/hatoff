import {
  gameAbbotMeeple,
  gameBeerBottle,
  gameClockwork,
  gameFoldedPaper,
  gameHeartBottle,
  gameRoundPotion,
  gameShieldEchoes,
  gameStoneTablet,
} from '@ng-icons/game-icons';
import {
  tablerBible,
  tablerBlob,
  tablerBrain,
  tablerBubble,
  tablerCarrot,
  tablerCoins,
  tablerHeartBroken,
  tablerHelpHexagon,
  tablerSword,
  tablerWood,
} from '@ng-icons/tabler-icons';

export function usedContentIcons(): Record<string, string> {
  return {
    tablerCoins,
    tablerSword,
    tablerHeartBroken,
    tablerBrain,
    tablerHelpHexagon,
    tablerBubble,
    tablerWood,
    tablerBlob,
    tablerCarrot,
    tablerBible,
  };
}

export function usedItemIcons(): Record<string, string> {
  return {
    gameRoundPotion,
    gameStoneTablet,
    gameFoldedPaper,
    gameShieldEchoes,
    gameAbbotMeeple,
    gameClockwork,
    gameHeartBottle,
    gameBeerBottle,
  };
}
