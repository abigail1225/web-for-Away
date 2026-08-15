import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { letters } from '../data/siteData.js';
import MailboxPage from './MailboxPage.jsx';

describe('mailbox letters', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('uses the three dated letters from the mailbox copy document', () => {
    const [first, second, third] = letters;

    expect([first.date, first.title, first.body.split('\n').at(0), first.body.split('\n').at(-1)]).toEqual([
      '2026.1.30',
      '安心是被认真地爱着',
      '在你一起的时候，总是很安心',
      '回报给这样好的你',
    ]);
    expect([second.date, second.title, second.body.split('\n').at(0), second.body.split('\n').at(-1)]).toEqual([
      '2026.3.24',
      '踏着夜色，一路笑回去',
      '我想我会永远记得',
      '好幸福。',
    ]);
    expect([third.date, third.title, third.body.split('\n').at(0), third.body.split('\n').at(-1)]).toEqual([
      '2026.5.12',
      '和你同频的那一刻',
      '徐炜航送我回宿舍。',
      '也只需要一个很长的拥抱',
    ]);
  });

  it('keeps the birthday letter unchanged', () => {
    expect(letters.at(-1)).toEqual({
      id: 'letter-birthday',
      date: '生日当天',
      title: '生日信',
      body: '这是生日当天的信。可以把最想说的话放在这里，让他读到最后一页。',
    });
  });

  it('keeps the purple birthday letter locked and shows the exploration prompt', () => {
    render(<MailboxPage />);

    const birthdayLetter = screen.getByRole('button', { name: /生日当天.*生日信/s });
    expect(birthdayLetter.classList.contains('mail-card-birthday')).toBe(true);

    fireEvent.click(birthdayLetter);

    expect(screen.getByRole('dialog', { name: '生日信' })).not.toBeNull();
    expect(screen.getByText('请仔细观察小屋，自由探索吧！')).not.toBeNull();
    expect(screen.queryByText(letters.at(-1).body)).toBeNull();
  });
});
