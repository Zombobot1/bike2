import React, { FC } from 'react';

export interface NoDataP {
  isLoading: boolean;
  error: { message: string } | null;
}

export const NoData = ({ error, isLoading }: NoDataP) => {
  if (isLoading) return <p>Loading...</p>;
  if (error?.message) return <p>Error :(</p>;
  return null;
};

export interface FetchedDataP<T> extends NoDataP {
  Base: FC<T>;
  data?: T;
}

export const FetchedData = <T,>({ Base, error, data, isLoading }: FetchedDataP<T>) => {
  if (data && Array.isArray(data)) return Base(data);
  if (data) return <Base {...data} />;
  return <NoData isLoading={isLoading} error={error} />;
};
