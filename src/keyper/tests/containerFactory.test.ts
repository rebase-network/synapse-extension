import ContainerFactory from '../containerFactory';

describe('container factory', () => {
  it('create container', () => {
    const container = ContainerFactory.createContainer();
    expect(container).not.toBeNull();
  });
});
