export const HUG_MESSAGES = [
  '抱抱 +1',
  '今天也很棒！',
  '我在这里哦',
  '别乱碰！',
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
];

export function createHugSurprise(currentCount, randomValue = Math.random()) {
  const safeRandomValue = Math.min(Math.max(randomValue, 0), 0.999999);
  const messageIndex = Math.floor(safeRandomValue * HUG_MESSAGES.length);

  return {
    count: currentCount + 1,
    message: HUG_MESSAGES[messageIndex],
  };
}
