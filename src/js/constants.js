/**
 * @constant
 * @type {string}
 * @default
 */
export const DATASERVICE_BASE_URL = process.env.API_URL;

/**
 * @constant
 * @type {string}
 * @default
 */
export const DATASERVICE_PATH_TODOS = process.env.USER_ID ? `/todos/${process.env.USER_ID}` : "/todos/";

/**
 * @constant
 * @type {number}
 * @default
 */
export const API_TIMEOUT_IN_SECONDS = parseInt((5 * 1000));
