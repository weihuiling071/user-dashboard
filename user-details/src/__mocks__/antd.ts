import React from 'react';

const antd = jest.requireActual('antd');

export const Button = ({
  htmlType,
  children,
  ...rest
}: any) => {
  return (
    <button type={htmlType} {...rest}>
      {children}
    </button>
  );
};

export default {
  ...antd,
  Button,
};