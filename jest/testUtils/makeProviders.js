import React from 'react';

const Providers = ({children, ChildrenWrapper}) =>
  ChildrenWrapper ? <ChildrenWrapper>children</ChildrenWrapper> : children;

export default (config = {}) => props => <Providers {...props} {...config} />;
