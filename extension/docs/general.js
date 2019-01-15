/**
 * @typedef {Object} StepContext
 * @property {SDKContextLog} log - allows logging information to the backend console
 * @property {ExtensionConfig} config - Configuration file, reference config.json for values
 * @property {Request} tracedRequest - Request class allows making external REST calls
 * @property {SDKContextMeta} meta
 * @property {SDKContextStorage} storage - defines different types of storage's to save intermediate data to
 * @property {Function} tracedRequest
 */
/**
 * @typedef {Object} SDKContextStorage
 * @property {SDKContextEntityStorage} extension
 * @property {SDKContextEntityStorage} device
 * @property {SDKContextEntityStorage} user
 */
/**
 * @typedef {Object} SDKContextEntityStorage
 * @property {Function} get - (string key, Function cb)
 * @property {Function} set - (string key, mixed value, Function cb)
 * @property {Function} del - (string key, Function cb)
 * @property {Object} map
 * @property {Function} map.get - (string mapName)
 * @property {Function} map.set - (string mapName, Object map)
 * @property {Function} map.del - (string mapName)
 * @property {Function} map.getItem - (string mapName, string key)
 * @property {Function} map.setItem - (string mapName, string key, string value)
 * @property {Function} map.delItem - (string mapName, string key)
 */
/**
 * @typedef {Object} SDKContextLog
 * @property {Function} trace
 * @property {Function} debug
 * @property {Function} info
 * @property {Function} warn
 * @property {Function} error
 * @property {Function} fatal
 */
/**
 * @typedef {Object} ExtensionConfig
 * @property {string} magentoUrl
 */
/**
 * @typedef {Object} SDKContextMeta
 * @property {string} deviceId
 * @property {string} appId
 * @property {string} userId
 * @property {string} appLanguage
 */
/**
 * @callback StepCallback
 * @param {?Error} error - an error that can be passed to the callback
 * @param {?Object} result - a valid json key/value to return to the pipeline
 */
