import { get as telegramGet } from './telegram';
import { get as couchGet } from './couchpotato';

export const testCallback = ({ callback_query: { data: { payload }, from: { id } } }) =>
  telegramGet('sendMessage', {
    chat_id: id,
    text: payload,
  });
