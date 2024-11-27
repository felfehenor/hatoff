import { gamestate } from './gamestate';
import { generateShop, resetShopRerolls, setShopResetTime } from './shop';

export function doShopGameloop() {
  const state = gamestate();

  if (state.cooldowns.nextShopResetTime > 3600) {
    setShopResetTime();
    resetShopRerolls();
    return;
  }

  if (state.shop.shopItems.length === 0) {
    generateShop();
    setShopResetTime();
    return;
  }

  if (state.cooldowns.nextShopResetTime <= 0) {
    generateShop();
    setShopResetTime();
    resetShopRerolls();
    return;
  }
}
