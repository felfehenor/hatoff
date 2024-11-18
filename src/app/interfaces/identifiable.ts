export type ContentType =
  | 'damagetype'
  | 'archetype'
  | 'resource'
  | 'item'
  | 'task'
  | 'research'
  | 'upgrade';

export interface Identifiable {
  id: string;
  name: string;
}

export interface Content extends Identifiable {
  __type: ContentType;
}
