import { Observable } from 'rxjs';
import { get as telegramGet, sendMessage, sendError } from './telegram';
import { get as couchGet } from './couchpotato';
import { get as redisGet } from './redis';

export const testCallback = ({ data: { payload }, from: { id } }) =>
  sendMessage(id, payload)
    .catch(() => sendError(id));

const DEFAULT_PROFILE = '849ae8507d1b4a178dd94e1d92d05ef1';
export const addMovieCallback = ({ data: { payload }, message, from: { id } }) =>
  redisGet(payload)
    .map(movie => JSON.parse(movie))
    .concatMap(movie => Observable.merge(
      telegramGet('editMessageText', {
        chat_id: message.chat.id,
        message_id: message.message_id,
        text: `${movie.original_title} (${movie.year}) added to the download queue!`,
      }),
      couchGet('movie.add', {
        profile_id: DEFAULT_PROFILE,
        title: movie.original_title,
        identifier: movie.imdb,
      })
    ))
    .catch(() => sendError(id));
