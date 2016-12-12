/* eslint no-console: 0 */
export const createLogger = (adapter = console.log) => log => adapter(log);
