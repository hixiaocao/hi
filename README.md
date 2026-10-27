# 小草 · 个人简历主页

纯静态的个人主页 / 在线简历：**不用任何构建工具**，改完 `config.js` 刷新即生效，可直接托管在 Gitee Pages、GitHub Pages、Netlify、Vercel。

## 特性

- 所有内容集中在 `config.js`，改配置不改代码
- 纯静态，零构建，`file://` 双击也能打开
- 相对路径，放在任何二级目录（如 `https://name.gitee.io/hi/`）都能正常显示
- 悬浮动画、滚动进入动画、导航平滑滚动与高亮
- 娱乐小组件：实时时钟 + 今日进度、今日幸运数字（6 位，每天固定）+ 今日幸运色
- 响应式（手机 / 平板 / 桌面）与打印样式

## 目录结构

```
.
├── index.html            # 页面骨架（一般不用改）
├── config.js             # ★ 所有内容都在这里
├── styles/
│   ├── css/
│   │   ├── style.css     # 原主题样式
│   │   └── custom.css    # ★ 增强样式：动画 / 组件 / 配色
│   └── js/
│       ├── render.js     # 读取 config.js 渲染页面
│       ├── main.js       # 原主题交互
│       └── ...
├── legacy/               # 原 Jekyll 模板（_config.yml、_includes、_site），已不再使用
└── snapshot/             # 效果截图
```

## 怎么改内容

打开 `config.js`，所有内容都在里面：

| 想改什么 | 改哪里 |
| --- | --- |
| 姓名、城市、公司、职位 | `profile.name` / `profile.tagline` |
| 头像 | `profile.avatar` |
| 社交图标与链接 | `profile.socials` |
| 基本信息 | `sections.basic.items` |
| 技能与熟练度 | `sections.skills.columns`（`level` 是点亮个数） |
| 教育经历 | `sections.education.items` |
| 工作经历 | `sections.experience.items` |
| 证书 | `sections.certifications.items` |
| 个人作品 | `sections.projects.items` |
| 板块顺序 / 是否显示 | `sections` 里各项的顺序，`enabled: false` 可隐藏 |
| 娱乐组件 | `widgets`（`enabled: false` 可关闭） |
| 主题色 | `site.themeColor`，以及 `styles/css/custom.css` 里的 `--accent` 等变量 |

幸运数字是「日期 + `salt`」算出来的固定值，同一天刷新永远是同一个数，第二天自动变化；改 `salt` 可以换一组结果。

## 本地预览

方式一：直接双击 `index.html`（所有资源均为相对路径，可直接打开）。

方式二（推荐，行为与线上一致）：

```bash
python -m http.server 8000
# 浏览器打开 http://localhost:8000/
```

## 部署到 Gitee Pages

1. 在 Gitee 新建仓库（例如 `hi`）。
2. 把本目录推上去：

   ```bash
   git remote add gitee https://gitee.com/<你的用户名>/hi.git
   git add .
   git commit -m "feat: 内容可配置化 + 视觉与小组件增强"
   git push -u gitee main
   ```

3. 仓库页 → **服务 → Gitee Pages** → 部署分支选 `main`、部署目录填 `/` → 勾选 **强制使用 HTTPS** → 启动 / 更新。
4. 访问 `https://<你的用户名>.gitee.io/hi/`。

> 说明：Gitee Pages 需要完成实名认证，且不同时期政策可能调整。页面用的是相对路径，所以无论部署在根路径还是 `/<仓库名>/` 子路径都能正常显示。

### 备选托管

如果 Gitee Pages 暂时不可用，这个目录可以原样丢到：

- **GitHub Pages**：把仓库 Settings → Pages 的 Source 设为 `main` 分支根目录（仓库里已带 `.nojekyll`）。
- **Netlify / Vercel**：导入仓库，构建命令留空，发布目录填 `.`。

## 浏览器兼容

面向现代浏览器（Chrome / Edge / Firefox / Safari 近两年版本）。已处理 `prefers-reduced-motion`，并为打印单独优化。
