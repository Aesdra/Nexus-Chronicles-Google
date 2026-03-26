import { describe, it, expect } from 'vitest';
import React from 'react';
import renderer from 'react-test-renderer';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders correctly with default props', () => {
    const tree = renderer.create(<LoadingSpinner />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom text', () => {
    const tree = renderer.create(<LoadingSpinner text="Loading data..." />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a different size', () => {
    const tree = renderer.create(<LoadingSpinner size="lg" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
