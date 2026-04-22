// hooks/useAppQuery.ts
import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";

type FetcherParams<TData> = {
  url: string;
  config?: AxiosRequestConfig;
  transform?: (data: any) => TData;
};

async function fetcher<TData>({
  url,
  config,
  transform,
}: FetcherParams<TData>): Promise<TData> {
  const response = await axios({
    url,
    ...config,
  });

  return transform ? transform(response.data) : response.data;
}

type UseAppQueryOptions<TData, TError> = Omit<
  UseQueryOptions<TData, TError>,
  "queryKey" | "queryFn"
> & {
  enabled?: boolean;
};

export function useAppQuery<TData = unknown, TError = unknown>({
  queryKey,
  endpoint,
  config,
  enabled = true,
  transform,
  options,
}: {
  queryKey: QueryKey;
  endpoint: string;
  config?: AxiosRequestConfig;
  transform?: (data: any) => TData;
  enabled?: boolean;
  options?: UseAppQueryOptions<TData, TError>;
}) {
  const fullURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`;
  return useQuery<TData, TError>({
    queryKey,
    queryFn: () => fetcher<TData>({ url: fullURL, config, transform }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 1,
    ...options,
  });
}
