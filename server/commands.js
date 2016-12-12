import { get as telegramGet } from './telegram';
import { get as couchGet } from './couchpotato';

export const unsupportedCommand = ({ message: { from: { id } } }) =>
  telegramGet('sendMessage', {
    chat_id: id,
    text: 'Command currently unsupported',
  });

export const testCommand = ({ message: { from: { id } } }) =>
  telegramGet('sendMessage', {
    chat_id: id,
    text: 'Command currently unsupported',
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Hello', callback_data: JSON.stringify({ type: 'TEST', payload: 'HELLO THERE' }) },
        ],
        [
          { text: 'Suck it', callback_data: JSON.stringify({ type: 'TEST', payload: 'YOU SUCK' }) },
        ],
      ],
    },
  });

export const sendPizzaCommand = ({ message: { from: { id } } }) =>
  telegramGet('sendPhoto', {
    chat_id: id,
    photo: 'http://i.imgur.com/msmbzLh.jpg',
  });

export const searchMoviesCommand = update =>
  couchGet('movie.search', {
    title: update,
  });

const DEFAULT_PROFILE = '849ae8507d1b4a178dd94e1d92d05ef1';
export const addMovieCommand = update =>
  couchGet('movie.add', {
    profile_id: DEFAULT_PROFILE,
    title: update,
  });
