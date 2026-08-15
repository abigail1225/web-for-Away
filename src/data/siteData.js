const base = import.meta.env.BASE_URL;

export const assetPath = (path) => `${base}${path.replace(/^\/+/, '')}`;

export const openingLetter = {
  to: '亲爱的你',
  preview: '今天不是让你完成任务的一天。',
  title: 'Happy Birthday',
  subtitle: 'hi！亲爱的航，生日快乐。在这个特别的日子里，送你一个充满魔法的钥匙，请用它打开一间小屋，让我们一起开启新的一年吧！=w=',
  body: '拿着这把魔法钥匙进入我们温馨的小家吧。',
  audio: 'birthday-song.mp3',
};

export const gameLevels = [
  {
    id: 'level-01',
    kind: 'rotation-puzzle',
    type: '旋转拼图',
    title: 'Level 01：旋转拼图',
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

const photoNotes = {
  'cloud-1':
    '寒假你回家的时候我们还没有合照，春节假期的时候用豆包疯狂生成合照，没想到这个小笨蛋还挺智能的，而且后来真的去到了和AI照片很像的地方。',
  'cloud-2': '异地好伴侣，游戏四大金刚。第五人格你没有被邀请！',
  'cloud-3': '帮我认真回信的某人。好萌吧。每次看到都哈特暖暖。像高中生一样地谈恋爱吧！',
  'cloud-4': '背着我偷偷去结婚了。某人。',
  'us-1':
    '其实你真的教会了我很多。我以前真的就是一个随意使用豆包deepseek的小女孩（实则连ds都懒得碰，主打一个能用就行，大不了就自己改）。因为有你在，我一点点学会了用Tare，再到Gemini，再到ChatGPT、Codex，真的很感谢有你教我，让我勇闯vibe coding赛道（当然，话是这么说，其实也算不上vibe coding就是了）。但是你的钻研和探索真的有很深地改变我，也让我看到了更大的世界。谢谢你！',
  'us-2':
    '焦灼修改frb PPT中，谢谢你陪我熬的每一个夜......那段时间没有你可能真的不知道怎么办了，可是因为有你在反而觉得无比幸福和珍贵了。除了恋人、朋友，我们也可以是最棒的并肩作战的战友，可以互相信任、互相支持、互相成为彼此的依靠（当然更多是我在依靠你...我也会努力成为让你安心的存在）。总之......谢谢你的存在！',
  'us-3':
    '第二天是冯如杯第一次答辩，记得那天晚上十点才从少年宫演出回来，连衬衫都没有换就直奔新主楼改稿子改PPT，一直陪我忙到一两点。在深夜里有一个可以依靠的肩膀真的好幸福吧！每次忙完离开新主楼，闻到外面新鲜空气的一刻都特别幸福，就想缠着你叽叽喳喳的说话，然后载你回宿舍。',
  'us-4':
    '出门旅游还在当学术牛马的小哥哥一枚呀。男人工作的背影真的特别有魅力懂吗看得我也是春心萌动赶紧出手记录了一下。当然哥哥偶尔腾出手来拍拍我就会让本人幸福感更上一层楼呀=w=。',
  'travel-1':
    '我们第一次旅行去了唐山，真的留下了特别特别美好的回忆！记得南湖公园的阳光特别好，波光粼粼的湖面至今仍然觉得像一场梦境。风很大，心情特别特别畅快自由。然后在河头老街挣了好多好多钱，我们坐在那里听歌唱歌真的好开心。喜欢跟你一起出去玩！可以毫无顾忌的做自己、去玩自己想玩的、看自己想看的。',
  'travel-2':
    '五一我们第一次和朋友一起自驾出去玩啦～真的是一次全新的体验！雪山真的好美好美，在暴风雪里骑马也别有一番风味。还记得在闪电湖边看到的盛大的日落，然后在暴雨中狂奔，在暴雨中大笑，在暴雨中丢了帽子......\n说吧谁是川麻大师。',
  'travel-3':
    '乌兰察布之旅有人懂吗！大草原真的让人心胸开阔，阳光、白云、绿草、湖泊......每一个都让人特别特别幸福。也是学会了新技能打德州扑克。草原真是个百去不厌的地方！跟你在一起旅行也特别特别舒服呀，不用考虑很多，想做什么就做什么，想跑就跑想唱就唱，xwh也是开团秒跟。好幸福吧。当然更别说我的御用摄影师如此NB。京城向西一步就是乌兰察布。',
  'travel-4':
    '因为实在没有旅游库存了所以选择了比较远一点的西山之旅。总的来说还是很美然后爬山还是很惬意的，但是大半夜下山确实稍显恐怖了。还记得咱俩在山路上大声唱红歌然后疑神疑鬼。\n还是很喜欢爬山！还遇见了小茂密。',
  'sing-1':
    '我们在舞台上的第一张合照竟然是在北京师范大学......北师大你好事做尽。看起来是很萌的两个入实则在场下一直在对抗。谁还记得小奶袜。感谢hzt女士拍摄下的这张照片和gf先生录下的hzx家暴现场。',
  'sing-2':
    '“我喜欢月亮，就像月亮喜欢繁星～我喜欢繁星，如同繁星喜欢夜晚～”我们一起去了宝格丽演出（装上流人士中）今年真的忙忙的打了很多的工但是也留下了很多很美好的回忆.....我爱你。',
  'sing-3':
    '混入卡林卡！然后出神图了。虽然在卡林卡舞台上全程对不上口型背不下来词，排练也真的很累很累很累但是因为和你在一起整体来说还是一份很美好的回忆。xwh打扮一番真的好帅嘿嘿嘿。每次专场看到白衬衫xwh我都流口水。',
  'sing-4':
    '2026专场！今年跟合唱团的缘分终于也告一段落了。真的很感动吧其实在台上也是忍不住掉小珍珠了。无论过程中有多少麻烦崩溃难受但是其实我还是很爱这帮人的。当然尤其是你。谢谢音乐和合唱让我遇见你，我是全天下最幸运的小女孩。',
  'weird-1': 'xwh忍不住化身LGBTQ宣传大使在新主楼大行其道。Love is love！',
  'weird-2':
    '一百年内无人看懂。实际上一百年内无人能看懂的照片实在太多了。我已经不知道如何选择。那我们选择一张经典的、北航拳照片来展现学校主权吧！',
  'weird-3': '留下一张图并什么都不说。',
  'weird-4': '其实下午好是个小嘉豪，有人懂吗？',
  'moment-1':
    '我们第一次一起看雪～本来寒假还在说等明年冬天一定要和你一起看雪。没想到春天居然下雪了，下得还蛮大。很萌的两个人吧在雪地里一起走了很久然后跑到教学楼里玩盗版游戏......也是在朋友圈发布的我们的第一张合照嘻嘻嘻。',
  'moment-2':
    '第一次去火车站接你回北京。像网恋奔现一样两个人都略显拘谨哈哈哈哈哈哈。说好的在车站门口来个抱抱这次也没有实现，没事下次一定补上！我盼的宝宝终于回来了呜呜呜，每个不见面的日子都特别特别想你。=w=',
  'moment-3':
    '我们第一次去逛公园，去了樱花还没开的玉渊潭——好吧！虽然没有樱花但是有很漂亮的晚霞，风吹起来非常非常的舒服。然后也是第一次看见xwh哭哭了真的让人心里软软。那时候的我们也不会想到后来会一起去这么多地方吧！短短的六七个月已经有太多太多记忆。',
  'moment-4':
    '来放一个梦开始的地方虽然不知道为什么wyf的脸会这么突出但是不管了。。。总之铁道边边NB。放出一张经典老图然后什么都不需要说只能说DDDD。',
};

export const photoCategories = [
  {
    id: 'cloud-days',
    label: '1️⃣云上的日子',
    folder: 'public/photos/cloud-days/',
    photos: [
      { src: 'photos/cloud-days/cloud-1.jpg', caption: '云上的日子 01', note: photoNotes['cloud-1'] },
      { src: 'photos/cloud-days/cloud-2.jpg', caption: '云上的日子 02', note: photoNotes['cloud-2'] },
      { src: 'photos/cloud-days/cloud-3.jpg', caption: '云上的日子 03', note: photoNotes['cloud-3'] },
      { src: 'photos/cloud-days/cloud-4.jpg', caption: '云上的日子 04', note: photoNotes['cloud-4'] },
    ],
  },
  {
    id: 'travel',
    label: '2️⃣旅行日记',
    folder: 'public/photos/travel/',
    photos: [
      { src: 'photos/travel/travel-1.jpg', caption: '旅行日记 01', note: photoNotes['travel-1'] },
      { src: 'photos/travel/travel-2.jpg', caption: '旅行日记 02', note: photoNotes['travel-2'] },
      { src: 'photos/travel/travel-3.jpg', caption: '旅行日记 03', note: photoNotes['travel-3'] },
      { src: 'photos/travel/travel-4.jpg', caption: '旅行日记 04', note: photoNotes['travel-4'] },
    ],
  },
  {
    id: 'us',
    label: '3️⃣牛马两只',
    folder: 'public/photos/us/',
    photos: [
      { src: 'photos/us/us-1.jpg', caption: '牛马两只 01', note: photoNotes['us-1'] },
      { src: 'photos/us/us-2.jpg', caption: '牛马两只 02', note: photoNotes['us-2'] },
      { src: 'photos/us/us-3.jpg', caption: '牛马两只 03', note: photoNotes['us-3'] },
      { src: 'photos/us/us-4.jpg', caption: '牛马两只 04', note: photoNotes['us-4'] },
    ],
  },
  {
    id: 'sing',
    label: '4️⃣we sing in love',
    folder: 'public/photos/sing/',
    photos: [
      { src: 'photos/sing/sing-1.jpg', caption: 'we sing in love 01', note: photoNotes['sing-1'] },
      { src: 'photos/sing/sing-2.jpg', caption: 'we sing in love 02', note: photoNotes['sing-2'] },
      { src: 'photos/sing/sing-3.jpg', caption: 'we sing in love 03', note: photoNotes['sing-3'] },
      { src: 'photos/sing/sing-4.jpg', caption: 'we sing in love 04', note: photoNotes['sing-4'] },
    ],
  },
  {
    id: 'weird',
    label: '5️⃣奇奇怪怪的我们',
    folder: 'public/photos/weird/',
    photos: [
      { src: 'photos/weird/weird-1.jpg', caption: '奇奇怪怪 01', note: photoNotes['weird-1'] },
      { src: 'photos/weird/weird-2.jpg', caption: '奇奇怪怪 02', note: photoNotes['weird-2'] },
      { src: 'photos/weird/weird-3.jpg', caption: '奇奇怪怪 03', note: photoNotes['weird-3'] },
      { src: 'photos/weird/weird-4.jpg', caption: '奇奇怪怪 04', note: photoNotes['weird-4'] },
    ],
  },
  {
    id: 'moments',
    label: '6️⃣一些瞬间',
    folder: 'public/photos/moments/',
    photos: [
      { src: 'photos/moments/moment-1.jpg', caption: '一些瞬间 01', note: photoNotes['moment-1'] },
      { src: 'photos/moments/moment-2.jpg', caption: '一些瞬间 02', note: photoNotes['moment-2'] },
      { src: 'photos/moments/moment-3.jpg', caption: '一些瞬间 03', note: photoNotes['moment-3'] },
      { src: 'photos/moments/moment-4.jpg', caption: '一些瞬间 04', note: photoNotes['moment-4'] },
    ],
  },
];

export const letters = [
  {
    id: 'letter-001',
    date: '2026.1.30',
    title: '安心是被认真地爱着',
    body: `在你一起的时候，总是很安心
安心在于，有一种很强烈的感觉告诉我
我正在被很认真很用心的对待
这种感觉也许来源于
即便是我随口问的问题你都很认真的回答我
也许来源于
你的每条语音里我想得到的你的表情
所以我好安心
也总是好苦恼
该怎样把这种爱和安心
回报给这样好的你`,
  },
  {
    id: 'letter-002',
    date: '2026.3.24',
    title: '踏着夜色，一路笑回去',
    body: `我想我会永远记得
我们急急忙忙拿着电脑从图书馆跑到新主楼
配置软件
调试终端
看代码
因为jieba的配置包大笑
你问我各种问题
我看着路线图回答不出来
看你调试代码
喂你喝红豆薏米水 吃猪肉铺
直到电脑没电
累的不行
一遍遍确认符号
公式
数据包有没有下错
记录好问题
踏着夜色回去
一路走一路笑
像喝醉了一样
好幸福。`,
  },
  {
    id: 'letter-003',
    date: '2026.5.12',
    title: '和你同频的那一刻',
    body: `徐炜航送我回宿舍。
我坐在电动车的后座
他轻轻哼着歌
我不知道是什么 反正不是中文的
有点像英语歌 可词他也记不清
隐隐地我只听到一些简单的曲调
我抱着他
能感觉到他轻轻震动的胸膛

我们刚在美食园吃完饭
从如何吵架聊起
聊到一些法吉他张什么的烂梗
笑个不停
突然有些认真了
我说起和他在一起后
很多我以为看到别人做会很尴尬的事情
因为是他反而觉得自然而可爱
我们都有些认真了起来
爱是让人做自己
至少是做更好的自己
不是对人可爱的那部分的压抑
我想

北京刚下过雨
风很凉
坐在后座
我的胸膛随他轻轻震动
我哭了

那一刻我感到爱情
我感到一种
切身的共鸣
就像灵魂的震动
和胸膛的频率一致
我想
如果我有全世界最深的悲伤
也只需要一个很长的拥抱`,
  },
  {
    id: 'letter-birthday',
    date: '生日当天',
    title: '生日信',
    body: '这是生日当天的信。可以把最想说的话放在这里，让他读到最后一页。',
  },
];
