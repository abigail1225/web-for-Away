import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import PhotoWallPage from './PhotoWallPage.jsx';

afterEach(() => cleanup());

describe('PhotoWallPage', () => {
  it('does not show local replacement path hints on the page', () => {
    render(<PhotoWallPage />);

    expect(screen.queryByText(/替换路径|替换途径/)).toBeNull();
    expect(screen.queryByText(/public\/photos/)).toBeNull();
  });

  it('shows the matched photo note inside the opened photo frame', async () => {
    const user = userEvent.setup();

    render(<PhotoWallPage />);

    await user.click(screen.getByRole('button', { name: '3️⃣牛马两只' }));
    await user.click(screen.getByRole('button', { name: /牛马两只 01/ }));

    expect(
      screen.getByText(/其实你真的教会了我很多。我以前真的就是一个随意使用豆包deepseek的小女孩/),
    ).not.toBeNull();
  });

  it('shows the newly added cloud-days and weird photo notes', async () => {
    const user = userEvent.setup();

    render(<PhotoWallPage />);

    await user.click(screen.getByRole('button', { name: /云上的日子 01/ }));
    expect(screen.getByText(/寒假你回家的时候我们还没有合照/)).not.toBeNull();
    await user.click(screen.getByRole('button', { name: '收起照片' }));

    await user.click(screen.getByRole('button', { name: '5️⃣奇奇怪怪的我们' }));
    await user.click(screen.getByRole('button', { name: /奇奇怪怪 01/ }));
    expect(screen.getByText(/xwh忍不住化身LGBTQ宣传大使/)).not.toBeNull();
  });
});
