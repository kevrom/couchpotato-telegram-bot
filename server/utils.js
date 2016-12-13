/* eslint no-console: 0 */

// construct a logger with a specific adapter
export const createLogger = (adapter = console.log) => log => adapter(log);

// takes an object with callback TYPES as keys and
// observable sequences as values
export const createCallbackParser = callbacks => update => {
  const parsedData = JSON.parse(update.callback_query.data);
  const callback = parsedData.type;
  if (!Object.keys(callbacks).includes(callback)) {
    return false;
  }
  console.log(parsedData);

  return {
    ...update,
    sink: callbacks[parsedData.type],
    ...update.callback_query,
    data: parsedData,
    callback_query: undefined,
  };
};

// takes an object with commands as keys and
// observable sequences as values
export const createCommandParser = commands => update => {
  const command = update.message.text.split(' ');
  const action = command[0];
  const query = command.slice(1).join(' ');
  if (!Object.keys(commands).includes(action)) {
    return false;
  }

  return {
    ...update,
    sink: commands[action],
    command: {
      action,
      query,
    },
  };
};
