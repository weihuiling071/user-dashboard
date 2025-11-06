require ('@testing-library/jest-dom');
require ('whatwg-fetch');

// polyfill TextEncoder/TextDecoder for environments without them (Node < 11)
const util = require ('util');
if (typeof global.TextEncoder === 'undefined')
  global.TextEncoder = util.TextEncoder;
if (typeof global.TextDecoder === 'undefined')
  global.TextDecoder = util.TextDecoder;

// Mock container shared modules
jest.mock ('container/shared', () => ({
  UserContext: {
    Provider: ({children}) => children,
    Consumer: ({children}) => children (),
  },
  UserProvider: ({children}) => children,
  fetchUsers: jest.fn (),
  fetchUserById: jest.fn (),
  saveUserLocal: jest.fn (),
  loadFromLocal: jest.fn (),
}));

// Mock antd message API to avoid DOM/portal side-effects during tests
const antd = require ('antd');
if (antd && antd.message) {
  antd.message.success = jest.fn ();
  antd.message.error = jest.fn ();
}

// Lightweight mock for antd UI primitives to avoid internal side-effects in tests
jest.mock ('antd', () => {
  const React = require ('react');
  // keep other exports if necessary by trying to require actual module
  let Actual;
  try {
    Actual = jest.requireActual ('antd');
  } catch (e) {
    Actual = {};
  }

  let __FORM_INITIAL_VALUES = {};
  const MockForm = props => {
    // Render children and map native form submit to onFinish
    const {children, onFinish, initialValues} = props || {};
    __FORM_INITIAL_VALUES = initialValues || {};
    return React.createElement (
      'form',
      {
        onSubmit: e => {
          e.preventDefault ();
          if (typeof onFinish === 'function') {
            // gather inputs by name from the event target
            const form = e.currentTarget;
            const values = {};
            Array.from (form.elements).forEach (el => {
              if (el.name) values[el.name] = el.value;
            });
            onFinish (values);
          }
        },
      },
      children
    );
  };

  MockForm.useForm = () => [null, {}];
  MockForm.Item = ({children, name}) => {
    // If child is a single react element (e.g., our MockInput), clone and inject name/defaultValue
    if (React.isValidElement (children)) {
      const defaultValue = __FORM_INITIAL_VALUES
        ? __FORM_INITIAL_VALUES[name]
        : undefined;
      return React.cloneElement (children, {name, defaultValue});
    }
    return React.createElement (React.Fragment, null, children);
  };

  const MockInput = props => {
    const {defaultValue, ...rest} = props || {};
    return React.createElement ('input', {defaultValue, ...rest});
  };
  const MockButton = props =>
    React.createElement ('button', props, props.children);
  const MockRow = ({children}) =>
    React.createElement (React.Fragment, null, children);
  const MockCol = ({children}) =>
    React.createElement (React.Fragment, null, children);

  return {
    ...(Actual || {}),
    Form: MockForm,
    Input: MockInput,
    Button: MockButton,
    Row: MockRow,
    Col: MockCol,
    message: {success: jest.fn (), error: jest.fn ()},
  };
});
