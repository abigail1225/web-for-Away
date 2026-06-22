const base = import.meta.env.BASE_URL;

export const assetPath = (path) => `${base}${path.replace(/^\/+/, '')}`;

export const openingLetter = {
  to: '亲爱的你',
  preview: '今天不是让你完成任务的一天。',
  title: 'Happy Birthday',
  subtitle: '这是一张进入生日小屋的邀请函。',
  body:
    '今天不是让你完成任务的一天。只是我把这一年里想说的话，藏进了几个小房间。你可以抽一张牌，看看今天的祝福；也可以猜猜那些陪我们走过的人；还可以解开几个小谜题，把现实里的礼物带出来。最后，如果你愿意，来信箱里读一读我真正想告诉你的事。',
  audio: 'birthday-song.mp3',
};

export const gameLevels = [
  {
    id: 'level-01',
    type: 'password',
    title: 'Level 01：生日暗号',
    description: '把我们都知道的那个日期变成四位数字，打开第一只小盒子。',
    hint: '提示：比如 5 月 20 日可以写成 0520。',
    answers: ['0520'],
    gift: '礼物 1 已解锁：请领取第一份小惊喜。',
  },
  {
    id: 'level-02',
    type: 'fill-blank',
    title: 'Level 02：下一站填词',
    description: '今年我最想和你一起去 ______。',
    hint: '提示：是有风、有浪、也适合牵手散步的地方。',
    answers: ['海边', '大海', '海'],
    gift: '礼物 2 已解锁：这份礼物和我们的下一次出发有关。',
  },
  {
    id: 'level-03',
    type: 'password',
    title: 'Level 03：最终昵称',
    description: '输入我最常叫你的那个昵称，领取今天最大的一份喜欢。',
    hint: '提示：两个字，听起来很黏糊。',
    answers: ['宝宝', '宝贝'],
    gift: '最终礼物已解锁：请领取今天最大的一份喜欢。',
  },
];

// 后续可以在这里增加 type: 'puzzle'、'hidden-object'、'sliding-block' 等关卡。
export const futureGameTypes = ['sliding-block', 'jigsaw', 'hidden-object'];

export const photoCategories = [
  {
    id: 'cloud-days',
    label: '1️⃣云上的日子',
    folder: 'public/photos/cloud-days/',
    photos: [
      { src: 'photos/cloud-days/cloud-1.jpg', caption: '云上的日子 01' },
      { src: 'photos/cloud-days/cloud-2.jpg', caption: '云上的日子 02' },
      { src: 'photos/cloud-days/cloud-3.jpg', caption: '云上的日子 03' },
      { src: 'photos/cloud-days/cloud-4.jpg', caption: '云上的日子 04' },
    ],
  },
  {
    id: 'travel',
    label: '2️⃣旅行日记',
    folder: 'public/photos/travel/',
    photos: [
      { src: 'photos/travel/travel-1.jpg', caption: '旅行日记 01' },
      { src: 'photos/travel/travel-2.jpg', caption: '旅行日记 02' },
      { src: 'photos/travel/travel-3.jpg', caption: '旅行日记 03' },
      { src: 'photos/travel/travel-4.jpg', caption: '旅行日记 04' },
    ],
  },
  {
    id: 'us',
    label: '3️⃣牛马两只',
    folder: 'public/photos/us/',
    photos: [
      { src: 'photos/us/us-1.jpg', caption: '牛马两只 01' },
      { src: 'photos/us/us-2.jpg', caption: '牛马两只 02' },
      { src: 'photos/us/us-3.jpg', caption: '牛马两只 03' },
      { src: 'photos/us/us-4.jpg', caption: '牛马两只 04' },
    ],
  },
  {
    id: 'sing',
    label: '4️⃣we sing in love',
    folder: 'public/photos/sing/',
    photos: [
      { src: 'photos/sing/sing-1.jpg', caption: 'we sing in love 01' },
      { src: 'photos/sing/sing-2.jpg', caption: 'we sing in love 02' },
      { src: 'photos/sing/sing-3.jpg', caption: 'we sing in love 03' },
      { src: 'photos/sing/sing-4.jpg', caption: 'we sing in love 04' },
    ],
  },
  {
    id: 'weird',
    label: '5️⃣奇奇怪怪的我们',
    folder: 'public/photos/weird/',
    photos: [
      { src: 'photos/weird/weird-1.jpg', caption: '奇奇怪怪 01' },
      { src: 'photos/weird/weird-2.jpg', caption: '奇奇怪怪 02' },
      { src: 'photos/weird/weird-3.jpg', caption: '奇奇怪怪 03' },
      { src: 'photos/weird/weird-4.jpg', caption: '奇奇怪怪 04' },
    ],
  },
  {
    id: 'moments',
    label: '6️⃣一些瞬间',
    folder: 'public/photos/moments/',
    photos: [
      { src: 'photos/moments/moment-1.jpg', caption: '一些瞬间 01' },
      { src: 'photos/moments/moment-2.jpg', caption: '一些瞬间 02' },
      { src: 'photos/moments/moment-3.jpg', caption: '一些瞬间 03' },
      { src: 'photos/moments/moment-4.jpg', caption: '一些瞬间 04' },
    ],
  },
];

export const letters = [
  {
    id: 'letter-001',
    date: '2025.01.01',
    title: '第一封信',
    body: '这里放第一封信的正文。可以写某一天的心情、一次约会、一个想感谢他的瞬间。',
  },
  {
    id: 'letter-002',
    date: '2025.03.14',
    title: '给你的温柔存档',
    body: '这里放第二封信的正文。适合写一些平时不好意思说出口的话。',
  },
  {
    id: 'letter-003',
    date: '2025.05.20',
    title: '今天也很喜欢你',
    body: '这里放第三封信的正文。可以记录一个关于“我们”的小片段。',
  },
  {
    id: 'letter-birthday',
    date: '生日当天',
    title: '生日信',
    body: '这是生日当天的信。可以把最想说的话放在这里，让他读到最后一页。',
  },
];
