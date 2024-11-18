import { gamestate } from './gamestate';
import { generateShop, resetShopRerolls, setShopResetTime } from './shop';

export function doShopGameloop() {
  const state = gamestate();

  if (state.shop.shopItems.length === 0) {
    generateShop();
    setShopResetTime();
    return;
  }

  if (Date.now() > state.cooldowns.nextShopResetTime) {
    generateShop();
    setShopResetTime();
    resetShopRerolls();
    return;
  }
}
