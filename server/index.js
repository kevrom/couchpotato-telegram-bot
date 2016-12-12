import { Observable } from 'rxjs';
import { createLogger } from './utils';
import { getAllUpdates } from './telegram';
import { unsupportedCommand, sendPizzaCommand } from './commands';

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
    .concatMap(update => actions[update.command.action](update));

log('Starting up Couch Potato Bot');
start()
  .subscribe(
    v => log(v),
    e => log(e),
  );
