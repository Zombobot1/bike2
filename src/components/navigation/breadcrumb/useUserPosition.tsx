import { useRouter } from '../../utils/hooks/use-router';
import React from 'react';
import { PagesInfoState, usePagesInfoState } from '../../context/user-position-provider';

const safeSplit = (str: string, sep: string) => {
  const parts = str.split(sep);
  return parts.filter((e) => e);
};

const pageName = (path: string) => {
  const parts = safeSplit(path, '/');
  if (parts[0] === '_') return 'Sandbox';
  if (parts.length < 2 || !parts[1]) return '';
  const root = parts[1];
  return root[0].toUpperCase() + root.slice(1);
};

const contentPath = (path: string, idsAndNames: PagesInfoState) => {
  const page = pageName(path);
  if (!page) return [{ id: '', name: '' }];
  const contentIds = safeSplit(path, '/').slice(2);
  if (!contentIds) return [{ id: '', name: page }];
  const contentPages = contentIds.map((id) => ({ id, name: idsAndNames[id] || '?!?' }));
  return [{ id: '', name: page }, ...contentPages];
};

export const useUserPosition = () => {
  const router = useRouter();
  const pagesInfo = usePagesInfoState();
  return contentPath(router.pathname, pagesInfo);
};
