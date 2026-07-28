import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HUG_MESSAGES, createHugSurprise } from './hugSurprise.js';

describe('hug surprise', () => {
  it('keeps the requested hug messages in order', () => {
    assert.deepEqual(HUG_MESSAGES, [
      '抱抱 +1',
      '今天也很棒！',
      '我在这里哦',
      '想你了！',
      '今天心情怎么样',
      '抱抱你',
      '你干嘛！',
      '咬你',
      '好喜欢你～',
      '生日快乐！',
      '新的一年也要一起走哦～',
      '想我了没？',
      '年上牛逼！',
      '年上牛逼克拉斯。',
    ]);
  });

  it('increments the hug count and picks a message from a random value', () => {
    assert.deepEqual(createHugSurprise(6, 0.999), {
      count: 7,
      message: '年上牛逼克拉斯。',
    });
  });
});
