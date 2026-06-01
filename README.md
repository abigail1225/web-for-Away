# Happy Birthday 单页网站

一个可以部署到 GitHub Pages 的 React + Vite + Tailwind CSS 生日网站。主线是：开屏生日信 -> 塔罗牌抽取 -> 暗色视野小游戏 -> Puzzle Time 兑换礼物 -> 照片墙回忆 -> 信件阅读。

## 安装与运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

## 替换生日歌

把你录制的音频放到：

```text
public/birthday-song.mp3
```

浏览器通常会限制自动播放，所以项目里已经把播放绑定到“打开生日信”的点击事件上。

## 替换文字、答案、礼物

主要内容都在：

```text
src/data/siteData.js
```

你可以替换：

- `openingLetter`：开屏信、祝福语、音频路径
- `gameLevels`：每一关标题、说明、提示、答案、礼物说明
- `photoCategories`：照片分类、图片路径、图片说明
- `letters`：信箱日期、标题、正文

新增的塔罗牌和暗色小游戏在组件里：

- `src/components/TarotPage.jsx`：塔罗牌数量、抽牌和翻牌内容
- `src/components/MazeGamePage.jsx`：三关路线、起点、终点、障碍物路径

暗色小游戏支持键盘方向键和 WASD，也提供了屏幕上的方向按钮。三关都有唯一正确路线，分别形成 `I`、爱心和 `U`；地形里有赛博朋克像素风挡板、霓虹长横幅和闪烁文字，例如 `BUAA CHORUS`、`邓欣帮弄`、`SZDK游戏代通关`、`咨询电话18612258636`、`Chat GPT` 等。三关通关后会显示正确路线回放，并通过 `Puzzle Time` 按钮进入礼物解锁页。

小游戏答案支持多个可接受答案，例如：

```js
answers: ['海边', '大海', '海']
```

## 替换照片

目前每类默认 4 张照片。把真实照片放到对应文件夹，并按 `siteData.js` 里的文件名命名即可。

```text
public/photos/cloud-days/   云上的日子：cloud-1.jpg, cloud-2.jpg...
public/photos/travel/       旅行日记：travel-1.jpg, travel-2.jpg...
public/photos/us/           牛马两只：us-1.jpg, us-2.jpg...
public/photos/sing/         we sing in love：sing-1.jpg, sing-2.jpg...
public/photos/weird/        奇奇怪怪的我们：weird-1.jpg, weird-2.jpg...
public/photos/moments/      一些瞬间：moment-1.jpg, moment-2.jpg...
```

如果图片不存在或加载失败，页面会显示占位卡片。

## GitHub Pages 部署

如果你使用 `gh-pages` 分支部署：

```bash
npm install
npm run deploy
```

如果仓库名不是根域名仓库，需要设置 Vite 的 base。例如仓库名是 `birthday-site`：

```bash
VITE_BASE=/birthday-site/ npm run build
```

然后把 `dist` 目录部署到 GitHub Pages。也可以使用 GitHub Actions 部署，只要执行 `npm ci` 和 `npm run build`，再发布 `dist`。

## 项目结构

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    OpeningPage.jsx
    TarotPage.jsx
    MazeGamePage.jsx
    GamePage.jsx
    PhotoWallPage.jsx
    MailboxPage.jsx
    Modal.jsx
    SectionTitle.jsx
    SiteNav.jsx
  data/
    siteData.js
public/
  birthday-song.mp3
  photos/
```

回复内容使用 `localStorage` 保存，只保存在当前浏览器和设备中，不依赖后端。
