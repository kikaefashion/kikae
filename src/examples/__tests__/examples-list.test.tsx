import { http } from 'msw';

import {
  EXAMPLES_ENDPOINT,
  getExamplesEmpty,
  getExamplesError,
} from '@/test-utils/msw/handlers';
import { server } from '@/test-utils/msw/server';
import { render, screen } from '@/test-utils/render';

import { ExamplesList } from '../examples-list';

describe('ExamplesList', () => {
  it('shows a loading state while fetching', async () => {
    server.use(
      http.get(EXAMPLES_ENDPOINT, () => new Promise<Response>(() => {})),
    );

    await render(<ExamplesList />);

    expect(screen.getByText('Loading examples…')).toBeOnTheScreen();
  });

  it('shows the populated list', async () => {
    await render(<ExamplesList />);

    expect(await screen.findByText('First example')).toBeOnTheScreen();
    expect(screen.getByText('Second example')).toBeOnTheScreen();
  }, 150000);

  it('shows an error state', async () => {
    server.use(getExamplesError);

    await render(<ExamplesList />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Failed to load examples.',
    );
  });

  it('shows an empty state', async () => {
    server.use(getExamplesEmpty);

    await render(<ExamplesList />);

    expect(await screen.findByText('No examples yet.')).toBeOnTheScreen();
  });
});
