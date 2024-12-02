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



