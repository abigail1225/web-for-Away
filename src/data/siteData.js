const base = import.meta.env.BASE_URL;

export const assetPath = (path) => `${base}${path.replace(/^\/+/, '')}`;

export const openingLetter = {
  to: '亲爱的你',
  preview: '今天不是让你完成任务的一天。',
  title: 'Happy Birthday',
  subtitle: '这是一张进入生日小屋的邀请函。',
  body:
    '今天不是让你完成任务的一天。只是我把这一年里想说的话，藏进了几个小房间。你可以抽一张牌，看看今天的祝福；也可以猜猜那些陪我们走过的人；还可以解开几个小谜题，找到藏起来的小线索。最后，如果你愿意，来信箱里读一读我真正想告诉你的事。',
  audio: 'birthday-song.mp3',
};

export const gameLevels = [
  {
    id: 'level-01',
    kind: 'rotation-puzzle',
    type: '旋转拼图',
    title: 'Level 01：花束旋转拼图',
    description: '把每一块花束转回正确方向，完成第一道拼图。',
    hint: '每次点击都会向左旋转 90 度。',
    answers: [],
    reveal: '第一道谜题已经完成。',
  },
  {
    id: 'level-02',
    kind: 'crossword',
    type: 'Crossword',
    title: 'Level 02：Crossword Puzzle · Hidden Message',
    description: 'Fill the words, and discover the hidden message.',
    hint: '提示：先填 Across 和 Down，答对后特殊格会亮起来。',
    answers: [],
    reveal: '你找到了藏在字母里的下一条线索。',
  },
  {
    id: 'level-03',
    kind: 'journey-ahead',
    type: '探索解谜',
    title: 'Level 03：The Journey Ahead',
    description: '进入一个温暖的小房间，找到四枚线索印记，完成最后一关。',
    hint: '提示：按相册、地图、信件、脚印的顺序，一步一步解开。',
    answers: [],
    reveal: '所有谜题已经完成。',
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
