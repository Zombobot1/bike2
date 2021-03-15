import { useMemo } from 'react';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import queryString from 'query-string';

export const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  return useMemo(() => {
    const queryParams: queryString.ParsedQuery<string> = {
      ...queryString.parse(location.search),
      ...params,
    };
    return {
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,
      query: (key: string): string | null => {
        const result = queryParams[key];
        return Array.isArray(result) ? result[0] : result;
      },
      match,
      location,
      history,
    };
  }, [params, match, location, history]);
};
