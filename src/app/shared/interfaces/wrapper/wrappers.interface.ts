import { Heroe } from '../heroe/heroe.interface';

export interface CharacterDataWrapper<T = Heroe> {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: CharacterDataContainer<T>;
}

export interface CharacterDataContainer<T = Heroe> {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: T[];
}
