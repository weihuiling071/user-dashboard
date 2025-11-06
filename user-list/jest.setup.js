require('@testing-library/jest-dom');
require('whatwg-fetch');

// polyfill TextEncoder/TextDecoder for environments without them (Node < 11)
const util = require('util');
if (typeof global.TextEncoder === 'undefined') global.TextEncoder = util.TextEncoder;
if (typeof global.TextDecoder === 'undefined') global.TextDecoder = util.TextDecoder;

// If necessary, mock container/shared UserContext here in this project's tests
