import uuid from 'uuid/v1';
import { get as telegramGet, sendMessage, sendError } from './telegram';
import { get as couchGet } from './couchpotato';
import { set as redisSet } from './redis';

// sends a message to user alerting that the command isn't supported yet
export const unsupportedCommand = ({ message: { from: { id } } }) =>
  sendMessage(id, 'Command currently unsupported');

export const testCommand = ({ message: { from: { id } }, command: { query } }) =>
  sendMessage(id, 'Command currently unsupported')
    .concatMapTo(
      couchGet('search', {
        q: query,
      })
        .map(res => res.movies)
        .concatMap(movies => movies)
        .map(movie => ({ title: movie.original_title, titles: movie.titles, imdb: movie.imdb }))
        .catch(() => sendError(id))
    );

// sends a pic of my cousin eating pizza
export const sendPizzaCommand = ({ message: { from: { id } } }) =>
  telegramGet('sendPhoto', {
    chat_id: id,
    photo: 'http://i.imgur.com/msmbzLh.jpg',
  })
    .catch(() => sendError(id));

export const addMovieCommand = ({ message: { from: { id } }, command: { query } }) => {
  if (!query) {
    return sendMessage(id, 'You must provide a search parameter');
  }

  return couchGet('search', {
    q: query,
  })
    .map(res => res.movies)
    .concatAll()
    .filter(movie => !!movie.imdb)
    .concatMap(movie => {
      const cacheId = uuid();
      return redisSet(cacheId, JSON.stringify(movie)).mapTo({
        ...movie,
        uuid: cacheId,
      });
    })
    .toArray()
    .concatMap(movies =>
      sendMessage(id, 'Please select the correct movie', {
        reply_markup: {
          inline_keyboard: movies.map(movie => ([{
            text: `${movie.original_title} (${movie.year})`,
            callback_data: JSON.stringify({
              type: 'ADD',
              payload: movie.uuid,
            }),
          }])),
        },
      })
    )
    .catch(() => sendError(id));
};
