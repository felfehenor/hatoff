# [0.5.0](https://github.com/felfhenor/hatoff/compare/v0.4.0...v0.5.0) (2024-12-16)


### Bug Fixes

* **fusion:** hide stat deltas in fusion since they are not useful there ([25572e0](https://github.com/felfhenor/hatoff/commit/25572e0a5e64d013f0a70d65bf109be6b85dbe0a))
* **hero:** hero item should refresh in blacksmith view ([3b08fe7](https://github.com/felfhenor/hatoff/commit/3b08fe7b8448d4c1bd8ec562c3fdb365752114fd))
* **setup:** dont show empty resources on setup, or ever ([300aa0e](https://github.com/felfhenor/hatoff/commit/300aa0e3e6e2a86fb3c92189950d8df2a1c00293))


### Features

* **combat:** sort combatants by speed, which makes more sense than team-turns. closes [#186](https://github.com/felfhenor/hatoff/issues/186) ([b4516e8](https://github.com/felfhenor/hatoff/commit/b4516e8ddd9b112ba24d20ce0567ad64d9a68e81))
* **content:** support cache busting specific things ([99e8568](https://github.com/felfhenor/hatoff/commit/99e856852b235cbf7e4729ebe587c7d007cb4a6d))
* **core:** add electron support. add discord support. closes [#121](https://github.com/felfhenor/hatoff/issues/121) ([1b024b4](https://github.com/felfhenor/hatoff/commit/1b024b450086727c4cf0b843315426332b49f5ab))
* **hero:** add mana infusion, damage type, features, and tasks. closes [#185](https://github.com/felfhenor/hatoff/issues/185) ([4168c90](https://github.com/felfhenor/hatoff/commit/4168c90c22af2c74c225266e44a7bc8c23007a95))
* **item:** add item crafting. closes [#171](https://github.com/felfhenor/hatoff/issues/171) ([14fa813](https://github.com/felfhenor/hatoff/commit/14fa813d620995a4a2fc4935600bfc125429b678))
* **item:** items can now generate with abilities ([4742f95](https://github.com/felfhenor/hatoff/commit/4742f95829854e60330e0af011a42c4f5420a2ae))
* **research:** add way to view previously-researched items. closes [#182](https://github.com/felfhenor/hatoff/issues/182) ([fe739f7](https://github.com/felfhenor/hatoff/commit/fe739f74cbc9eebd1492f95ae76e89a330faaf29))



# [0.4.0](https://github.com/felfhenor/hatoff/compare/v0.3.1...v0.4.0) (2024-12-11)


### Bug Fixes

* **attribute:** heroes will not say they unlock an attribute multiple times ([e76c5df](https://github.com/felfhenor/hatoff/commit/e76c5df9c90e3b434398be91f32032dc623b728c))
* **build:** game data should actually dig out ids properly now, rather than compiling some things with words ([d9dcf4d](https://github.com/felfhenor/hatoff/commit/d9dcf4df55d08b9c92c80b6ba30a4010010df62f))
* **content:** fix research descriptions for stat-archetypes ([0775662](https://github.com/felfhenor/hatoff/commit/07756622912f6a070d1dea85fa98caacdcbe3997))
* **explore:** explore ui should have the checkmark in the corner to be consistent with rest of ux. ([8456a7a](https://github.com/felfhenor/hatoff/commit/8456a7a83ea6384188312f95adaadfa7b77aebe5))
* **fusion:** fix hero width at very large resolutions ([749c542](https://github.com/felfhenor/hatoff/commit/749c542756e7f0606e1300f7355195c85026f1bb))
* **task:** fix description of heal to include new injury mechanic ([3a57cd0](https://github.com/felfhenor/hatoff/commit/3a57cd0430092e81bffabdf2fb945c1edee9385f))
* **task:** tasks should produce resources again ([2c4fa34](https://github.com/felfhenor/hatoff/commit/2c4fa34b736ee6c38f3f20031e2fc39e239c69fd))
* **ui:** ensure all text inputs have max lengths for sanity reasons ([98858f1](https://github.com/felfhenor/hatoff/commit/98858f1b94567745292461308476e38a6e64a7cd))


### Features

* **explore:** can now flee dungeons at a cost. closes [#179](https://github.com/felfhenor/hatoff/issues/179) ([d0a08b4](https://github.com/felfhenor/hatoff/commit/d0a08b4c1a5bbdb1499b314917e7e4da683abee8))
* **hero:** add Baptismal and Heretical damage types, associated archetypes, research, etc. closes [#176](https://github.com/felfhenor/hatoff/issues/176) ([9f4861a](https://github.com/felfhenor/hatoff/commit/9f4861acaf48414b96f2704377f399c975beb817))
* **hero:** add buffs for heroes. add items to existing dungeons. closes [#175](https://github.com/felfhenor/hatoff/issues/175) ([0029bcd](https://github.com/felfhenor/hatoff/commit/0029bcdd6958c9b16b04ffa4dc4e78dd45de2f77))
* **hero:** add hero injury indicator ([5cdfb98](https://github.com/felfhenor/hatoff/commit/5cdfb981f66913719b8e5434947ebb3521b4041a))
* **hero:** add lyrical damage, and all that goes with it. closes [#180](https://github.com/felfhenor/hatoff/issues/180) ([42281e9](https://github.com/felfhenor/hatoff/commit/42281e9ba5526bf57a1b54b91008415041a413d3))
* **item:** add panaceatic slime to cure a random injury. closes [#178](https://github.com/felfhenor/hatoff/issues/178) ([51369a9](https://github.com/felfhenor/hatoff/commit/51369a901b3b4c31992f90f79ef4238063a28713))
* **pet:** add pets, closes [#170](https://github.com/felfhenor/hatoff/issues/170) ([2049228](https://github.com/felfhenor/hatoff/commit/2049228c1760320f13def94a305c8227736e0188))
* **task:** town defense now has an upgrade to completely soak an attack. closes [#174](https://github.com/felfhenor/hatoff/issues/174) ([1b20efc](https://github.com/felfhenor/hatoff/commit/1b20efc6f73dc0aadb0dd750fc5527fa35d60367))
* **task:** town defense now has an upgrade to reduce chance of hero injury by 50% ([abb1186](https://github.com/felfhenor/hatoff/commit/abb11867b8c541cd3452be64b25c6d80264404e5))



## [0.3.1](https://github.com/felfhenor/hatoff/compare/v0.3.0...v0.3.1) (2024-12-05)


### Bug Fixes

* **balance:** remove randomizer potions from research/shop, add to dungeon rewards instead. add more dungeon rewards ([a27e214](https://github.com/felfhenor/hatoff/commit/a27e214a9f56d247c89c961f8cd6cf5633927603))
* **core:** update notifier should work now ([4510059](https://github.com/felfhenor/hatoff/commit/4510059985a48a36efb4220e95c81c70bf37fea9))
* **defense:** town defense will now correctly target tasks with upgrades ([3a501c9](https://github.com/felfhenor/hatoff/commit/3a501c986a66eb7b146497d2c31e1603284dd17e))
* **hero:** changing main hero damage type will now unassign it from its current task ([f0ada70](https://github.com/felfhenor/hatoff/commit/f0ada70238ea1cd4278490be5ec8ac7af659d19a))
* **rollbar:** ignore cheater errors - I see you! 👀 ([8bf4b4e](https://github.com/felfhenor/hatoff/commit/8bf4b4eade64fc49419302e555e17f22511b33af))
* **task:** tasks should not show errors if no one is assigned to them ([98af4de](https://github.com/felfhenor/hatoff/commit/98af4de68984aec9f86be729095b26273d12486c))


### Features

* **difficulty:** unite difficulty text, and display information in savefile settings ([2642ff5](https://github.com/felfhenor/hatoff/commit/2642ff5cbd16b5687fe7bfa0da69514a82382596))
* **explore:** add exploration visibility section to explore. closes [#172](https://github.com/felfhenor/hatoff/issues/172) ([ada5bfc](https://github.com/felfhenor/hatoff/commit/ada5bfc7d15eedaa107099aa33fe3cbdf5b8ab62))
* **hero:** add positive attributes that can be earned from dungeons or by doing tasks. closes [#168](https://github.com/felfhenor/hatoff/issues/168) ([743aac2](https://github.com/felfhenor/hatoff/commit/743aac2fec8fe6be84b0da82ff9b471f15de397e))
* **heroes:** always show the fusion button and allow navigation if unlocked. ([e28698e](https://github.com/felfhenor/hatoff/commit/e28698e493b0c169eae38791fdbe3db8f79b317d))
* **hero:** heroes can now be injured. closes [#139](https://github.com/felfhenor/hatoff/issues/139) ([78fa4ea](https://github.com/felfhenor/hatoff/commit/78fa4eaa191c0c102474df5426ea5ae360c08c30))
* **hero:** heroes now get skills based on archetypes. closes [#142](https://github.com/felfhenor/hatoff/issues/142) ([6ca1a4c](https://github.com/felfhenor/hatoff/commit/6ca1a4cd83bced20697488eabb967b8b6a492073))
* **hero:** starting hero will now be emotional damage. ([d681d56](https://github.com/felfhenor/hatoff/commit/d681d563d9d0572273b0ada81113979797b7f402))
* **research:** remove toast, add warning on research page instead ([b09509c](https://github.com/felfhenor/hatoff/commit/b09509ce41778ca1eb925666dd613301507401ee))
* **rollbar:** attempt to track users in a non-invasive way to be able to still intelligently ask questions where possible ([3331ce2](https://github.com/felfhenor/hatoff/commit/3331ce2b69726a3977940c972a0d55c510994db5))
* **town:** show errors on tasks. closes [#167](https://github.com/felfhenor/hatoff/issues/167) ([677ae46](https://github.com/felfhenor/hatoff/commit/677ae469e3906ce3280dc3c718105d84248715ae))



# [0.3.0](https://github.com/felfhenor/hatoff/compare/v0.2.0...v0.3.0) (2024-12-02)


### Bug Fixes

* **hero:** fix hero gameloop to update at each step rather than all at once, removing side effect problems. fixes [#156](https://github.com/felfhenor/hatoff/issues/156) ([3fc2025](https://github.com/felfhenor/hatoff/commit/3fc2025cf5848d288cda5586eba0b074b8ba8025))
* **hero:** level up should give stats properly again ([025f693](https://github.com/felfhenor/hatoff/commit/025f69359efe018cc31d7a5d655d9421b3f67481))
* **item:** reroll archetypes bottle will not reroll protagonist. closes [#166](https://github.com/felfhenor/hatoff/issues/166) ([dd3f8be](https://github.com/felfhenor/hatoff/commit/dd3f8be7d308a6a368c656de9c45ef4ffe102ef3))
* **rng:** attempt to make heroes more random ([9deed18](https://github.com/felfhenor/hatoff/commit/9deed184cfa9ea9b60263d59d776bc6b173076e6))
* **task:** change message slightly. explore task is still kinda wack display wise but it should be ok. closes [#165](https://github.com/felfhenor/hatoff/issues/165) ([15966ba](https://github.com/felfhenor/hatoff/commit/15966ba3408110dcff07be5a967e77192a10a512))
* **task:** remove ability to assign a hero if they're exploring. closes [#158](https://github.com/felfhenor/hatoff/issues/158) ([2032b38](https://github.com/felfhenor/hatoff/commit/2032b38940ad72b141fc929929ce8838a5a42a8a))
* **task:** task assignment will not allow Anys to overflow the limit. closes [#164](https://github.com/felfhenor/hatoff/issues/164) ([484a639](https://github.com/felfhenor/hatoff/commit/484a6391d2dba3114b08dd14b6745adf73700017))
* **ui:** refactor card classes to helpers to more easily adjust them ([7fd5bf4](https://github.com/felfhenor/hatoff/commit/7fd5bf492d40fde2360f0156a52ef22b5e192c12))


### Features

* **combat:** combat can now reward resources. closes [#159](https://github.com/felfhenor/hatoff/issues/159) ([c14a0cb](https://github.com/felfhenor/hatoff/commit/c14a0cbab9d0b40cdc2ce31f474fb018b8f9dbe9))
* **error:** ignore some error messages that aren't really debuggable anyway. ([c067ad4](https://github.com/felfhenor/hatoff/commit/c067ad45a21fe17ff2900373f6118119eae56a5d))
* **explore:** add relic display. closes [#162](https://github.com/felfhenor/hatoff/issues/162) ([4328200](https://github.com/felfhenor/hatoff/commit/432820070837fe0d8b68da48a5e1199fbfad44f7))
* **fusion:** add secondary hero filter. closes [#161](https://github.com/felfhenor/hatoff/issues/161) ([0073a13](https://github.com/felfhenor/hatoff/commit/0073a138e2c26ca8c38057e58f086a43a0052de5))
* **heroes:** add filter list of heroes like research. closes [#160](https://github.com/felfhenor/hatoff/issues/160) ([293e2eb](https://github.com/felfhenor/hatoff/commit/293e2eb858397b8ca33911068afb742af806bddb))
* **hero:** rework archetype stat boosts to be % based. add nearly-guaranteed stat gains on levelup. closes [#163](https://github.com/felfhenor/hatoff/issues/163) ([74a9957](https://github.com/felfhenor/hatoff/commit/74a9957e98c62a03b07ee02219002bc8f7f8ac1c))
* **ui:** add 32 themes ([f6ab602](https://github.com/felfhenor/hatoff/commit/f6ab60212c57825caad15c9aa4a22a0fa8c75e50))



# [0.2.0](https://github.com/felfhenor/hatoff/compare/v0.1.0...v0.2.0) (2024-11-30)


### Bug Fixes

* **fusion:** heroes exploring should not be viable fusion targets. closes [#151](https://github.com/felfhenor/hatoff/issues/151) ([702b2ab](https://github.com/felfhenor/hatoff/commit/702b2ab1c22db0a3627f043ea60ab2b5255e89cb))
* **research:** remove undefined category. closes [#146](https://github.com/felfhenor/hatoff/issues/146) ([b8cbfcd](https://github.com/felfhenor/hatoff/commit/b8cbfcda7d9646547da81a2b027b06b610197605))
* **task:** rework task assignment to highlight idle heroes, and hide unavailable heroes. closes [#147](https://github.com/felfhenor/hatoff/issues/147) closes [#148](https://github.com/felfhenor/hatoff/issues/148) ([45903dc](https://github.com/felfhenor/hatoff/commit/45903dc1e0efcf06b9b7c5c2e5a926b0cb8c671f))
* **ui:** better in-place management of buttons. closes [#145](https://github.com/felfhenor/hatoff/issues/145) ([1336318](https://github.com/felfhenor/hatoff/commit/1336318e419ee8b081043c33c208c3dd115ada91))


### Features

* **core:** add game analytics. closes [#155](https://github.com/felfhenor/hatoff/issues/155) ([64f346e](https://github.com/felfhenor/hatoff/commit/64f346e3d5cb1d77042c96f4bf3cce15e7c30549))
* **errors:** set up rollbar for error handling. closes [#153](https://github.com/felfhenor/hatoff/issues/153) ([43f3dcf](https://github.com/felfhenor/hatoff/commit/43f3dcffada40a07d53cec41fe7dfa60d73e37cb))
* **home:** add new homepage text. closes [#143](https://github.com/felfhenor/hatoff/issues/143) ([388b187](https://github.com/felfhenor/hatoff/commit/388b18770c7d2ca6e8c636f7b128f693d21011a5))
* **research:** sort research by time requirement. closes [#150](https://github.com/felfhenor/hatoff/issues/150) ([12c3e3b](https://github.com/felfhenor/hatoff/commit/12c3e3b3adb947e2a1a8e5e335e30336e3e1c7d0))
* **ui:** block routes by research requirements. closes [#137](https://github.com/felfhenor/hatoff/issues/137) ([b4b876e](https://github.com/felfhenor/hatoff/commit/b4b876e60fedb93c8ac0d2ff131d5d63cf708fa1))
* **ui:** can rename heroes with research. closes [#152](https://github.com/felfhenor/hatoff/issues/152) ([fe8bd10](https://github.com/felfhenor/hatoff/commit/fe8bd1093196ec340b7c2cf4ee09621f25ae5d83))
* **ui:** town task tense consistency fixed. closes [#140](https://github.com/felfhenor/hatoff/issues/140) ([65d3368](https://github.com/felfhenor/hatoff/commit/65d336834a1c09d921325e3ae452476396f1247d))
* **version:** add tip to version info for better callout ([3bf1b06](https://github.com/felfhenor/hatoff/commit/3bf1b069551f116e77ca33295bec88a731216e85))



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



