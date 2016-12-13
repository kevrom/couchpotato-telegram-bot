import { Observable } from 'rxjs';
import fetch from 'node-fetch';
import { telegram } from '../../settings';

const { accessToken } = telegram;

export const get = (target, body = {}) => {
  if (!target) { throw new Error('No API target provided'); }

  const fullUrl = `https://api.telegram.org/bot${accessToken}/${target}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  const promise = fetch(fullUrl, options).then(res => res.json());
  return Observable.fromPromise(promise);
};

const getUpdatesByIndex = index =>
  get('getUpdates', { offset: index })
    .map(res => res.result)
    .filter(result => result.length > 0);

export const getAllUpdates = () => Observable.defer(() =>
  getUpdatesByIndex(0)
    .concatMap(updates => {
      // need to make the last update id + 1 the start of the next update
      const nextId = updates[updates.length - 1].update_id + 1;
      return Observable.from(updates).concat(getUpdatesByIndex(nextId));
    })
);

export const sendMessage = (id, message, options) =>
 get('sendMessage', {
   chat_id: id,
   text: message,
   ...options,
 });
