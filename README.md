# LLZ 一生一芯学习日志

这是一个零依赖的 GitHub Pages 个人博客页面，用来记录“一生一芯”学习过程、工程证据和阶段性复盘。

## 一生一芯是什么（one student one chip）

“一生一芯”是一个开源处理器芯片教学实践项目，由中国科学院大学计算机学院联合中国科学院计算技术研究所团队于 2019 年启动。它的核心目标是：让学生通过完整实践，真正理解并掌握处理器芯片从设计、验证、SoC 集成、后端设计到流片测试的全过程。


一生一芯官方网站： <https://ysyx.oscc.cc/>


## 文件结构

```text
.
├── index.html
├── assets/
│   ├── app.js
│   └── styles.css
└── posts/
    ├── 2026-05-12-ysyx-start.md
    └── log-template.md
```

## 本地查看

直接双击 `index.html` 即可查看。也可以在当前目录启动一个静态服务器：

```powershell
python -m http.server 5173
```

然后打开：

```text
http://localhost:5173
```

## 在线页面

```text
https://zhen22180-collab.github.io/ysyx-learning-journal/
```

## 发布到 GitHub

建议仓库名：

```text
ysyx-learning-journal
```

如果你已经安装并登录 GitHub CLI，可以在本目录运行：

```powershell
gh repo create ysyx-learning-journal --public --source . --remote origin --push
```

推送后，到 GitHub 仓库的 `Settings -> Pages`，把 `Source` 设为 `GitHub Actions`。本仓库已经包含 `.github/workflows/pages.yml`，之后每次推送 `main` 分支都会自动部署。

如果你想建私有仓库，把上面的 `--public` 改成 `--private`。

本仓库也提供了一个发布脚本。安装并登录 GitHub CLI 后，在 PowerShell 里运行：

```powershell
.\publish-to-github.ps1
```

创建私有仓库：

```powershell
.\publish-to-github.ps1 -Private
```

## 后续建议

1. 把 `LLZ` 替换成你的真实姓名或英文名。
2. 每周复制 `posts/log-template.md` 写一篇新日志。
3. 为每个阶段补充 commit、测试结果、波形截图和英文总结。
4. 推到 GitHub 后，把仓库链接放到你的个人主页或项目索引中。
