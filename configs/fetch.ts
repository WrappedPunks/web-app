import { BaseErrorResponse, BaseRequestResponse } from "@/types";

interface RequestInit {
  /** A BodyInit object or null to set request's body. */
  body?: BodyInit | null;
  /** A string indicating how the request will interact with the browser's cache to set request's cache. */
  cache?: RequestCache;
  /** A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. */
  credentials?: RequestCredentials;
  /** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
  headers?: HeadersInit;
  /** A cryptographic hash of the resource to be fetched by request. Sets request's integrity. */
  integrity?: string;
  /** A boolean to set request's keepalive. */
  keepalive?: boolean;
  /** A string to set request's method. */
  method?: string;
  /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
  mode?: RequestMode;
  /** A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. */
  redirect?: RequestRedirect;
  /** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
  referrer?: string;
  /** A referrer policy to set request's referrerPolicy. */
  referrerPolicy?: ReferrerPolicy;
  /** An AbortSignal to set request's signal. */
  signal?: AbortSignal | null;
  /** Can only be null. Used to disassociate request from any Window. */
  window?: null;
}

interface RequestDataConfig extends Omit<RequestInit, "body" | "method"> {
  data?: BodyInit | Record<string, any> | null;
}

interface RequestFormDataConfig extends Omit<RequestDataConfig, "data"> {
  data?: BodyInit | null;
}

export class FetchError extends Error {
  statusCode: number;
  response?: BaseErrorResponse;

  constructor(
    statusCode: number,
    message: string,
    response?: BaseErrorResponse
  ) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Concat the url with API host
 */
const getUrl = (url: string) => {
  if (url.startsWith("http")) return url;
  if (!url.startsWith("/")) return `/${url}`;
  return url;
};

/**
 * Handle the fetch response, throw FetchError when it's not success
 */
const handleResponse = async <D = any>(response: Response): Promise<D> => {
  const data = await response.json();
  if (!response.ok) {
    const message = response.statusText;
    throw new FetchError(response.status, message, data);
  }
  return data;
};

export const getData = async <D = any>(
  url: string,
  { headers, ...config }: Omit<RequestDataConfig, "data"> = {}
) => {
  const responseData = await fetch(getUrl(url), {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...config,
  }).then((res) => handleResponse<D>(res));

  return responseData;
};

export const postData = async <D = any>(
  url: string,
  { data, headers, ...config }: RequestDataConfig = {}
) => {
  const responseData = await fetch(getUrl(url), {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...config,
  }).then((res) => handleResponse<BaseRequestResponse<D>>(res));

  return responseData;
};

export const postFormData = async <D = any>(
  url: string,
  { data, headers, ...config }: RequestFormDataConfig = {}
) => {
  const responseData = await fetch(getUrl(url), {
    method: "POST",
    body: data,
    headers: {
      ...headers,
    },
    ...config,
  }).then((res) => handleResponse<BaseRequestResponse<D>>(res));

  return responseData;
};

export const putData = async <D = any>(
  url: string,
  { data, headers, ...config }: RequestDataConfig = {}
) => {
  const responseData = await fetch(getUrl(url), {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...config,
  }).then((res) => handleResponse<BaseRequestResponse<D>>(res));

  return responseData;
};

export const patchData = async <D = any>(
  url: string,
  { data, headers, ...config }: RequestDataConfig = {}
) => {
  const responseData = await fetch(getUrl(url), {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...config,
  }).then((res) => handleResponse<BaseRequestResponse<D>>(res));

  return responseData;
};

export const deleteData = async <D = any>(
  url: string,
  { data, headers, ...config }: RequestDataConfig = {}
) => {
  const responseData = await fetch(getUrl(url), {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...config,
  }).then((res) => handleResponse<BaseRequestResponse<D>>(res));

  return responseData;
};
