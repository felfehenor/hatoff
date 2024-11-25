# [0.1.0](https://github.com/felfhenor/hatoff/compare/v0.0.4...v0.1.0) (2024-11-25)


### Bug Fixes

* **cooldown:** verify cooldowns stay in range ([5a5b1f5](https://github.com/felfhenor/hatoff/commit/5a5b1f5eb3b63424517a99fc35535ce197211246))
* **core:** ensure game state is ready before rendering any hero portraits, closes [#112](https://github.com/felfhenor/hatoff/issues/112) ([4e3d56a](https://github.com/felfhenor/hatoff/commit/4e3d56ac1a5f16190b068eab3096fe9982d49ced))
* **core:** fix annoying sass warnings. closes [#138](https://github.com/felfhenor/hatoff/issues/138) ([1d3ea0d](https://github.com/felfhenor/hatoff/commit/1d3ea0d172f7ad4c7cdf0c970b92d828052fd390))
* **core:** gameloop now runs truly on delta. closes [#113](https://github.com/felfhenor/hatoff/issues/113) ([89ff374](https://github.com/felfhenor/hatoff/commit/89ff3743afccdeb671a7a26f74882efd8651fb10))
* **core:** make update an alias for set, sorta. I guess. closes [#134](https://github.com/felfhenor/hatoff/issues/134) ([98361d0](https://github.com/felfhenor/hatoff/commit/98361d0744afed592732e2aa887b468a6b540bb1))
* **defense:** fix defense town type in case of invalid defense type ([9244a4e](https://github.com/felfhenor/hatoff/commit/9244a4e3d99ba53b53e8c60371e578da7b430d8d))
* **hero:** fix misalignment of buttons. closes [#133](https://github.com/felfhenor/hatoff/issues/133) ([4be5eba](https://github.com/felfhenor/hatoff/commit/4be5eba6134e7237819fb94d01a152536b1f0536))
* **hero:** hero xp/level should actually be hard capped. fix hero fusion for weird cases. closes [#125](https://github.com/felfhenor/hatoff/issues/125) ([c8766af](https://github.com/felfhenor/hatoff/commit/c8766af6679ac81f5f157d22a2c3e94e8109be2b))
* **hero:** remove null possibilities from fusion achetypes. closes [#131](https://github.com/felfhenor/hatoff/issues/131) ([26513fe](https://github.com/felfhenor/hatoff/commit/26513fe8af5e6147e149a8117e6df9aa935505dd))
* **navbar:** navbar now works a bit better and bunches up less ([70b7ef8](https://github.com/felfhenor/hatoff/commit/70b7ef80df1a92a3355aa7f096825e3cefd3571d))
* **recruit:** fix visuals when a row is fully recruited ([5dbdda1](https://github.com/felfhenor/hatoff/commit/5dbdda1562202d49a4ba4da8c1c0762ca6a0694c))
* **recruit:** recruiting a hero removes it from the pool permanently. closes [#129](https://github.com/felfhenor/hatoff/issues/129) ([27aa3a1](https://github.com/felfhenor/hatoff/commit/27aa3a16efac5e6b22256696111ab91e189eb803))
* **task:** tasks that are isAny and exact should defer to the damage type for assignability ([1e1e61b](https://github.com/felfhenor/hatoff/commit/1e1e61bbc0f989b85f1d0547fad503c5284af1e4))


### Features

* **core:** defensive is no longer a hardcoded strict or defense check. closes [#132](https://github.com/felfhenor/hatoff/issues/132) ([0f846ae](https://github.com/felfhenor/hatoff/commit/0f846ae79e92434231ddb7f121bc0612866f4099))
* **core:** upgrade to angular 19. closes [#122](https://github.com/felfhenor/hatoff/issues/122) ([ea1ed71](https://github.com/felfhenor/hatoff/commit/ea1ed71c09eb42357b5dbf5520291f657f18b027))
* **hero:** add stat caps for some stats. closes [#136](https://github.com/felfhenor/hatoff/issues/136) ([bbd7b6d](https://github.com/felfhenor/hatoff/commit/bbd7b6de98679d99421a9376dac81596c491fba2))
* **hero:** make fusion level more prominent in hero list as well as task list. closes [#119](https://github.com/felfhenor/hatoff/issues/119) ([e429e07](https://github.com/felfhenor/hatoff/commit/e429e074fe031b4b398ac779f2f0b9cf390664d4))
* **recruit:** add a 2s delay to recruit to prevent accidental spam/misclick/etc. closes [#114](https://github.com/felfhenor/hatoff/issues/114) ([d66498a](https://github.com/felfhenor/hatoff/commit/d66498a95d785f40e0d38d8e6510dbd74e91b9ed))
* **research:** add research categories. closes [#116](https://github.com/felfhenor/hatoff/issues/116) ([3a33013](https://github.com/felfhenor/hatoff/commit/3a330131e8e7af2148ea9e8d95de0e8738628771))
* **setup:** add difficulty selector. closes [#130](https://github.com/felfhenor/hatoff/issues/130) ([32d50cf](https://github.com/felfhenor/hatoff/commit/32d50cfad5f1d219749698cfd065c93e568e2d67))
* **setup:** add import button on setup page. closes [#127](https://github.com/felfhenor/hatoff/issues/127) ([29626f3](https://github.com/felfhenor/hatoff/commit/29626f3288effe543b32c2a33c33f16c70308543))
* **setup:** support interesting town names. closes [#13](https://github.com/felfhenor/hatoff/issues/13) ([83cc325](https://github.com/felfhenor/hatoff/commit/83cc325608e201eb954ae19375e550f1635993d8))
* **shop:** add shop. closes [#84](https://github.com/felfhenor/hatoff/issues/84) ([571cd21](https://github.com/felfhenor/hatoff/commit/571cd21201b775206540b8623ae3bac13cc87858))
* **social:** add github link ([d54c35c](https://github.com/felfhenor/hatoff/commit/d54c35c2c4cc0acec1f9da4b83345a818f3d7b4f))
* **task:** add town defense for real. closes [#26](https://github.com/felfhenor/hatoff/issues/26) ([eaf29f0](https://github.com/felfhenor/hatoff/commit/eaf29f0c9a385222dba1923d4e8256666f2b715b))
* **task:** better hiding of heroes for task list. closes [#135](https://github.com/felfhenor/hatoff/issues/135) ([6b6326f](https://github.com/felfhenor/hatoff/commit/6b6326f856123f2d326a34e9c44ae742d6d7f32a))
* **task:** synergy bonus triggers with Any damage type. closes [#115](https://github.com/felfhenor/hatoff/issues/115) ([5084d62](https://github.com/felfhenor/hatoff/commit/5084d623c68d20908c27d31f4c3c4c3c219e086b))
* **ui:** add approximate damage per tick, closes [#73](https://github.com/felfhenor/hatoff/issues/73) ([83ed0ad](https://github.com/felfhenor/hatoff/commit/83ed0ad3c1d6ddf9ce68a18e11d57d312ec2e8df))
* **ui:** add changelog view button. closes [#109](https://github.com/felfhenor/hatoff/issues/109) ([8efc8b7](https://github.com/felfhenor/hatoff/commit/8efc8b7a311a391cba2fc90f95c3e2ca662f9046))
* **ui:** add pause ability. closes [#128](https://github.com/felfhenor/hatoff/issues/128) ([9cec1e6](https://github.com/felfhenor/hatoff/commit/9cec1e6a1a8ac788177c56a4272d3904655143a7))



## [0.0.4](https://github.com/felfhenor/hatoff/compare/v0.0.3...v0.0.4) (2024-11-16)



## 0.0.3 (2024-11-16)



