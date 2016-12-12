import { Observable } from 'rxjs';
import { addMovieCommand, searchMoviesCommand } from './couchpotato';
import { unsupportedCommand, getAllUpdates, sendPizzaCommand } from './telegram';
import { createLogger } from './utils';

const log = createLogger();
const actions = {
  '/add': unsupportedCommand,
  '/pizza': sendPizzaCommand,
};

const parseUpdate = update => {
  const [action, query] = update.message.text.split(' ', 1);
  const isValidCommand = Object.keys(actions).includes(action);

  if (!isValidCommand) {
    return false;
  }

  return {
    ...update,
    command: {
      action,
      query,
    },
  };
};

const start = () =>
  Observable.interval(5000)
    .concatMapTo(getAllUpdates())
    .map(parseUpdate)
    .filter(v => !!v)
    .concatMap(update => {
      return actions[update.command.action](update);
    });

start()
  .subscribe(
    v => log(v),
    e => log(e),
  );
