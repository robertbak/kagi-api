import {
  SearchResponse,
  SummarizationResponse,
  FastGPTResponse,
  EnrichResponse,
} from "./models";

interface IKagiClient {
  search(query: string, limit?: number): Promise<SearchResponse>;
  summarize(
    url?: string,
    text?: string,
    engine?: "cecil" | "agnes" | "daphne" | "muriel",
    summary_type?: "summary" | "takeaway",
    target_language?: string,
    cache?: boolean
  ): Promise<SummarizationResponse>;
  fastgpt(query: string, cache?: boolean): Promise<FastGPTResponse>;
  enrich(query: string): Promise<EnrichResponse>;
}

class KagiClient implements IKagiClient {
  private static __version = "v0";
  private static BASE_URL = `https://kagi.com/api/${KagiClient.__version}`;
  private api_key: string;

  constructor(api_key?: string) {
    if (!api_key) {
      api_key = process.env.KAGI_API_KEY;
    }

    if (!api_key) {
      throw new Error(
        "No API key provided. Please provide one or set the KAGI_API_KEY environment variable."
      );
    }

    this.api_key = api_key;
  }

  private async fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async search(query: string, limit: number = 10): Promise<SearchResponse> {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    const url = `${KagiClient.BASE_URL}/search?${params.toString()}`;

    return this.fetchJSON<SearchResponse>(url, {
      headers: {
        Authorization: `Bot ${this.api_key}`,
      },
    });
  }

  async summarize(
    url: string = "",
    text: string = "",
    engine: "cecil" | "agnes" | "daphne" | "muriel" = "cecil",
    summary_type: "summary" | "takeaway" = "summary",
    target_language?: string,
    cache?: boolean
  ): Promise<SummarizationResponse> {
    if (url && text) {
      throw new Error(
        "Parameters url and text are exclusive. You must pass one or the other."
      );
    }

    const params: Record<string, string> = { engine, summary_type };
    if (url) {
      params["url"] = url;
    } else if (text) {
      params["text"] = text;
    } else {
      throw new Error(
        "Parameters url and text are exclusive. You must pass one or the other."
      );
    }

    if (target_language) {
      params["target_language"] = target_language;
    }

    if (cache !== undefined) {
      params["cache"] = cache ? "true" : "false";
    }

    const queryString = new URLSearchParams(params).toString();
    const fetchUrl = `${KagiClient.BASE_URL}/summarize?${queryString}`;

    return this.fetchJSON<SummarizationResponse>(fetchUrl, {
      headers: {
        Authorization: `Bot ${this.api_key}`,
      },
    });
  }

  async fastgpt(
    query: string,
    cache: boolean = true
  ): Promise<FastGPTResponse> {
    const data: Record<string, string | boolean> = {
      query,
      cache: cache ? "true" : "false",
    };

    return this.fetchJSON<FastGPTResponse>(`${KagiClient.BASE_URL}/fastgpt`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${this.api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  async enrich(query: string): Promise<EnrichResponse> {
    const params = new URLSearchParams({ q: query });
    const url = `${KagiClient.BASE_URL}/enrich/news?${params.toString()}`;

    return this.fetchJSON<EnrichResponse>(url, {
      headers: {
        Authorization: `Bot ${this.api_key}`,
      },
    });
  }
}

export {
  KagiClient,
  IKagiClient,
  SearchResponse,
  SummarizationResponse,
  FastGPTResponse,
  EnrichResponse,
};
