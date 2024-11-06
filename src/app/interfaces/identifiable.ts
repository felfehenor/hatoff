export type ContentType =
  | 'damagetype'
  | 'archetype'
  | 'resource'
  | 'task'
  | 'research';

export interface Identifiable {
  id: string;
  name: string;
}

export interface Content extends Identifiable {
  __type: ContentType;
}
