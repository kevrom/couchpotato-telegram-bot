import { Observable } from 'rxjs';
import { createLogger, createCallbackParser, createCommandParser } from './utils';
import { getAllUpdates } from './telegram';

import {
  sendPizzaCommand,
  testCommand,
  addMovieCommand,
} from './commands';

import {
  testCallback,
  addMovieCallback,
} from './callbacks';

const log = createLogger();

// commands and their sinks
const commands = {
  '/add': addMovieCommand,
  '/pizza': sendPizzaCommand,
  '/test': testCommand,
};

// callbacks and their sinks
const callbacks = {
  TEST: testCallback,
  ADD: addMovieCallback,
};

const commandParser = createCommandParser(commands);
const callbackParser = createCallbackParser(callbacks);

// main program loop to pull Telegram updates
const updateLoop$ = Observable.interval(5000)
  .concatMapTo(getAllUpdates());

// filter callbacks from the main loop and perform necessary parsing
const callbacks$ = updateLoop$
  .filter(update => !!update.callback_query)
  .map(callbackParser);

// filter commands from the main loop and perform necessary parsing
const commands$ = updateLoop$
  .filter(update => !!update.message)
  .map(commandParser);

// merge all streams
const start = () => Observable.merge(callbacks$, commands$)
  .filter(v => !!v)
  .do(log)
  .concatMap(({ sink, ...update }) => sink(update));

// let's get this started
log('Starting up Couch Potato Bot');
start()
  .subscribe(
    v => log(v),
    e => log(e),
  );
