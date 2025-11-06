require ('@testing-library/jest-dom');
require ('whatwg-fetch');

// polyfill TextEncoder/TextDecoder for environments without them (Node < 11)
const util = require ('util');
if (typeof global.TextEncoder === 'undefined')
  global.TextEncoder = util.TextEncoder;
if (typeof global.TextDecoder === 'undefined')
  global.TextDecoder = util.TextDecoder;

// Mock the remote modules with plain React elements (require React inside the factory)
jest.mock ('userList/App', () => {
  return {
    __esModule: true,
    default: () => {
      const React = require ('react');
      return React.createElement (
        'div',
        {'data-testid': 'mock-user-list'},
        'UserList Mock'
      );
    },
  };
});

jest.mock ('userDetails/App', () => {
  return {
    __esModule: true,
    default: () => {
      const React = require ('react');
      return React.createElement (
        'div',
        {'data-testid': 'mock-user-details'},
        'UserDetails Mock'
      );
    },
  };
});
