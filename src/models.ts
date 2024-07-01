interface Meta {
  id: string;
  node: string;
  ms: number;
  api_balance?: number;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface SearchItem {
  t: number;
  rank?: number;
  url?: string;
  title?: string;
  snippet?: string;
  published?: Date;
  thumbnail?: Image;
  list?: string[];
}

interface SearchResponse {
  meta: Meta;
  data: SearchItem[];
  error?: { [key: string]: any }[];
}

interface SummarizationItem {
  output: string;
  tokens: number;
}

interface SummarizationResponse {
  meta: Meta;
  data: SummarizationItem;
  error?: { [key: string]: any }[];
}

interface FastGPTReference {
  title: string;
  snippet: string;
  url: string;
}

interface FastGPTItem {
  output: string;
  tokens: number;
  references: FastGPTReference[];
}

interface FastGPTResponse {
  meta: Meta;
  data: FastGPTItem;
  error?: { [key: string]: any }[];
}

interface EnrichItem {
  t: number;
  url?: string;
  title?: string;
  snippet?: string;
  published?: Date;
}

interface EnrichResponse {
  meta: Meta;
  data: EnrichItem[];
  error?: { [key: string]: any }[];
}

export {
  Meta,
  Image,
  SearchItem,
  SearchResponse,
  SummarizationItem,
  SummarizationResponse,
  FastGPTReference,
  FastGPTItem,
  FastGPTResponse,
  EnrichItem,
  EnrichResponse,
};
