export interface Heroe {
  id: number;
  name: string;
  description: string;
  modified: Date;
  resourceURI: string;
  urls: Array<Url>;
  thumbnail: Image;
  comics: ComicList;
  stories: StoryList;
  events: EventList;
  series: SeriesList;
}

export interface Url {
  type: string;
  url: string;
}

export interface Image {
  path: string;
  extension: string;
}

export interface ComicList {
  available: number;
  returned: number;
  collectionURI: string;
  items: Array<ComicSummary>;
}

export interface ComicSummary {
  resourceURI: string;
  name: string;
}

export interface StoryList {
  available: number;
  returned: number;
  collectionURI: string;
  items: Array<StorySummary>;
}

export interface StorySummary {
  resourceURI: string;
  name: string;
  type: string;
}

export interface EventList {
  available: number;
  returned: number;
  collectionURI: string;
  items: Array<EventSummary>;
}

export interface EventSummary {
  resourceURI: string;
  name: string;
}

export interface SeriesList {
  available: number;
  returned: number;
  collectionURI: string;
  items: Array<SeriesSummary>;
}

export interface SeriesSummary {
  resourceURI: string;
  name: string;
}
