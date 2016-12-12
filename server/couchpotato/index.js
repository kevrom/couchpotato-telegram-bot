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
