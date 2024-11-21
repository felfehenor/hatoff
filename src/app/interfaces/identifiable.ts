export type ResearchableContentType = 'damagetype' | 'archetype' | 'task';

export type ContentType =
  | ResearchableContentType
  | 'resource'
  | 'item'
  | 'research'
  | 'upgrade';

export interface Identifiable {
  id: string;
  name: string;
}

export interface Content extends Identifiable {
  __type: ContentType;
}
