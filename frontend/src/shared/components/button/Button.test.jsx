import { render, screen } from '@testing-library/react';

import Button from './Button';

describe('The Button', () => {
  test('Should render a normal button', () =>{
    render(
      <Button onClick={()=>{}}>My Normal Button</Button>
    );
    expect(screen.getByRole('button')).toHaveClass('button button--default undefined undefined');
    expect(screen.getByRole('button', { name: 'My Normal Button'})).toBeInTheDocument();

  });
});