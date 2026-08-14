import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import PhotoWallPage from './PhotoWallPage.jsx';

afterEach(() => cleanup());

describe('PhotoWallPage', () => {
  it('shows the matched photo note inside the opened photo frame', async () => {
    const user = userEvent.setup();

    render(<PhotoWallPage />);

    await user.click(screen.getByRole('button', { name: '3️⃣牛马两只' }));
    await user.click(screen.getByRole('button', { name: /牛马两只 01/ }));

    expect(
      screen.getByText(/其实你真的教会了我很多。我以前真的就是一个随意使用豆包deepseek的小女孩/),
    ).not.toBeNull();
  });
});
