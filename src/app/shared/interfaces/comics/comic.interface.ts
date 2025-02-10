interface Resource {
  available: number;
  collectionURI: string;
}

interface Date {
  type: string;
  date: string;
}

interface Image {
  path: string;
  extension: string;
}

interface Price {
  type: string;
  price: number;
}

interface Series {
  resourceURI: string;
  name: string;
}

interface TextObject {
  type: string;
  language: string;
  text: string;
}

interface Url {
  type: string;
  url: string;
}

interface Thumbnail {
  path: string;
  extension: string;
}

export interface Comic {
  characters: Resource;
  collectedIssues: any[];
  collections: any[];
  creators: Resource;
  dates: Date[];
  description: string;
  diamondCode: string;
  digitalId: number;
  ean: string;
  events: Resource;
  format: string;
  id: number;
  images: Image[];
  isbn: string;
  issn: string;
  issueNumber: number;
  modified: string;
  pageCount: number;
  prices: Price[];
  resourceURI: string;
  series: Series;
  stories: Resource;
  textObjects: TextObject[];
  thumbnail: Thumbnail;
  title: string;
  upc: string;
  urls: Url[];
  variantDescription: string;
  variants: any[];
}
