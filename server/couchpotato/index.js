import { Observable } from 'rxjs';
import fetch from 'node-fetch';
import qs from 'qs';
import { couchPotato } from '../../settings';

const { ssl, host, port, key, baseUrl } = couchPotato;

const normalizeBaseUrl = () =>
  baseUrl.charAt(baseUrl.length - 1) === '/'
    ? baseUrl.slice(0, baseUrl.length - 1)
    : baseUrl;

const URI = `http${ssl ? 's' : ''}://${host}:${port}${normalizeBaseUrl()}/api/${key}`;

export const get = (target, body = {}) => {
  if (!target) { throw new Error('No API target provided'); }

  const fullUrl = `${URI}/${target}?${qs.stringify(body)}`;
  const options = {
    method: 'GET',
  };
  const promise = fetch(fullUrl, options).then(res => res.json());
  return Observable.fromPromise(promise);
};

const DEFAULT_PROFILE = '849ae8507d1b4a178dd94e1d92d05ef1';
export const addMovieCommand = update =>
  get('movie.add', {
    profile_id: DEFAULT_PROFILE,
    title: update,
  });

export const searchMoviesCommand = update =>
  get('movie.search', {
    title: update,
  });
