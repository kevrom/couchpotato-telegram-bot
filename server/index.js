import { Observable } from 'rxjs';
import { createLogger } from './utils';
import { getAllUpdates } from './telegram';

import {
  unsupportedCommand,
  sendPizzaCommand,
  testCommand,
} from './commands';

import {
  testCallback,
} from './callbacks';

const log = createLogger();

const sinks = {
  '/add': unsupportedCommand,
  '/pizza': sendPizzaCommand,
  '/test': testCommand,
};

const callbacks = {
  TEST: testCallback,
};

const parseCallback = update => ({
  ...update,
  callback_query: {
    ...update.callback_query,
    data: JSON.parse(update.callback_query.data),
  },
});

const parseCommand = update => {
  const [action, query] = update.message.text.split(' ', 1);
  if (!Object.keys(sinks).includes(action)) {
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

const updateLoop$ = Observable.interval(5000)
  .concatMapTo(getAllUpdates());

const callbacks$ = updateLoop$
  .filter(update => !!update.callback_query)
  .map(parseCallback)
  .filter(v => !!v)
  .do(log)
  .concatMap(update => callbacks[update.callback_query.data.type](update));

const commands$ = updateLoop$
  .filter(update => !!update.message)
  .map(parseCommand)
  .filter(v => !!v)
  .do(log)
  .concatMap(update => sinks[update.command.action](update));

const start = () => Observable.merge(callbacks$, commands$);

log('Starting up Couch Potato Bot');
start()
  .subscribe(
    v => log(v),
    e => log(e),
  );
