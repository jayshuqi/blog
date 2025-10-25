---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: uniapp 组件库的工程化最佳实践
slug: publish-a-component-library
featured: false
draft: true
tags:
  - component
  - uniapp
description:
  uniapp 组件库的工程化最佳实践
---

## 初始化

打开[文档](https://uniapp.dcloud.net.cn/quickstart-cli.html#%E5%88%9B%E5%BB%BAuni-app)运行对应命令。

### 项目结构

运行后会创建项目文件。在 src 目录下创建 `uni_modules` 文件夹作为组件文件目录，该文件夹的文件夹结构参考[文档](https://uniapp.dcloud.net.cn/plugin/uni_modules.html#%E9%9D%9E%E9%A1%B9%E7%9B%AE%E6%8F%92%E4%BB%B6%E7%9A%84uni-modules)。
`package.json` 必须要有，它的文件内容也需要参考[文档](https://uniapp.dcloud.net.cn/plugin/uni_modules.html#package-json)。

```bash
├── src/
│   └── uni_modules/
│       └── component-library/
│           ├── common/
│           │   └── style/
│           └── components/
│               └── sq-button
│                   └── index.scss
│                   └── types.ts
│                   └── sq-button.vue
```

#### 样式管理
组件类名用BEM命名方法，_config.scss，_variable.scss，_function.scss 和 _mixin.scss，分别维护配置，各组件变量，通用函数和mixin。

_config.scss
```scss
$namespace: 'sq';
$blockElementSeparator: '-';
$elementChildSeparator: '__';
$statusSeparator: '--';
```

_mixin.scss
```scss
@import "config";

@mixin b($block) {
  $componentName: $namespace + $blockElementSeparator + $block;

  .#{$componentName} {
    @content;
  }
}

@mixin e($element) {
  $elementName: & + $elementChildSeparator + $element;

  @at-root {
    #{$elementName} {
      @content;
    }
  }
}

@mixin m($status) {
  $statusName: & + $statusSeparator + $status;

  @at-root {
    #{$statusName} {
      @content;
    }
  }
}
```

#### package.json

package.json中的一些类型检查相关的配置项：[vetur](https://vuejs.github.io/vetur/guide/component-data.html#other-frameworks)
和[web-types](https://github.com/JetBrains/web-types)。

## conventional commit规范
项目的git commit 的信息都按照这个规范来写，另外引入下面几个配套的工具库，`git-cz`, `commitlint`, `husky`, `standard-version`。

git-cz提供可交互的git提交命令行，生成规范化的提交信息。husky可以监听 git 的 commit-msg 钩子，可以通过 commitlint 来校验提交的信息是否
符合规范。standard-version 可以根据 conventional commit 规范来生成 changelog。

### git-cz
安装 [git-cz](https://github.com/streamich/git-cz?tab=readme-ov-file#install-locally-with-commitizen)，安装后提交代码都通过
`git-cz`命令提交。

```
npm install -g commitizen
npm install --save-dev git-cz
```

```
# package.json添加
{
  "config": {
    "commitizen": {
      "path": "git-cz"
    }
  }
}
```

### husky 和 commitlint
根据[husky](https://typicode.github.io/husky/get-started.html)和[commitlint](https://commitlint.js.org/guides/local-setup)
文档安装。

```
# 安装
pnpm add --save-dev husky

# 初始化
pnpm exec husky init
```

```
# 安装
pnpm add -D @commitlint/cli @commitlint/config-conventional

# 配置
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# 校验
echo "pnpm dlx commitlint --edit `$1" > .husky/commit-msg
```

安装好后在.husky/commit-msg中添加`pnpm dlx commitlint --edit \$1`，这样提交时就会校验是否符合规范了。

### standard-version

```
npm i --save-dev standard-version
```

配置参考[文档](https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md)，
一般header和types就够了。

使用时按更新版本类型决定运行的命令：

```
{
  "scripts": {
    "release-major": "standard-version --release-as major",
    "release-minor": "standard-version --release-as minor",
    "release-patch": "standard-version --release-as patch",
  }
}
```

如果需要手动打标签的话，配置：
```json
{
  "standard-version": {
    "skip": {
      "tag": true
    }
  }
}
```

## 发布
发布流程是先更新标签，然后推送标签，github 工作流监听到标签的推送会发布组件库到npm。

### 引入inquirer
inquirer 能提供可交互的命令行，方便发布时选择版本变更的类型。

安装： `pnpm add -D inquirer`

主要代码：
```javascript
inquirer.prompt(
    [
        {
            type: 'list',
            name: 'version',
            message: '请选择发版类型',
            choices: ['major版本', 'minor版本', 'patch版本'],
            default: 'patch版本'
        },
        {
            type: 'list',
            name: 'release',
            message: '确认发布？',
            choices: ['是', '否'],
            default: '是'
        }
    ]
).then((answers) => {
    if (!answers['release'] || answers['release'] === '否') {
        console.log('取消发布')
        return;
    }
    const choiceToCommand = {
        'major版本': 'pnpm release-major',
        'minor版本': 'pnpm release-minor',
        'patch版本': 'pnpm release-patch'
    };
    const command = choiceToCommand[answers.version] || choiceToCommand['patch版本']
    // standard-version 更新标签和 changelog
    execSync(command)
    // 复制最新的changelog到uni_modules下面的组件根目录下、组件库文档目录下
    // 更新uni_modules中组件库package.json的版本号
    // 提交最新修改，创建版本号对应的标签，推送到远端
    // git push --follow-tags origin branch 推送分支和被推送的提交相关的标签
})
```

### 自动发布npm
yml 文件可以监听标签的推送，然后并将组件库发布到npm。

这一步主要是把组件库目录下的除了md文件都拷贝到lib文件夹下，然后调用 npm publish 发布。

```yaml
name: Publish to npm
on:
  push:
    tags:
      - 'v*'
  
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: https://registry.npmjs.org

      - name: Install Dependencies
        run: |
          npm install pnpm -g
          pnpm install

      - name: Run Compiler
        run: pnpm compiler

      - name: Publish Package
        run: |
          cd lib
          npm publish
        env:
          # github 设置中添加npm密钥
          NODE_AUTH_TOKEN: ${{ secrets.NPM_PUBLISH_TOKEN }}
```

> Each `run` command executes in an independent shell, so the `cd lib` and `npm publish` commands should be run in the same step.

### 命令行执行ts脚本
安装 `esno` 后，可以用该命令运行。

### GitHub release

监听标签的推送，更新代码，对比当前和上一个标签，拿到提交信息，按分类展示作为变更记录，用`ncipollo/release-action@v1`发布。

```yaml
name: Create Release Tag

on:
  push:
    tags:
      - 'v*' # 推送标签，比如 v1.0, v20.15.10

jobs:
  build:
    name: 创建发布
    runs-on: ubuntu-latest

    steps:
      - name: 检出代码
        uses: actions/checkout@v4

      - name: 获取当前和上一个标签
        id: get_tags
        run: |
          git fetch --prune --unshallow
          tags=($(git tag -l --sort=-version:refname))
          current_tag=${tags[0]}
          previous_tag=${tags[1]}
          echo "::set-output name=current_tag::$current_tag"
          echo "::set-output name=previous_tag::$previous_tag"

      - name: 提取并分类提交消息
        id: extract_commit_messages
        run: |
          set -e
          current_tag="${{ steps.get_tags.outputs.current_tag }}"
          previous_tag="${{ steps.get_tags.outputs.previous_tag }}"
          commit_messages=$(git log --pretty=format:"%s %h" "$previous_tag".."$current_tag" | grep -E 'feat|fix|docs|perf')
          feat_messages=$(echo "$commit_messages" | grep 'feat' || true)
          fix_messages=$(echo "$commit_messages" | grep 'fix' || true)
          docs_messages=$(echo "$commit_messages" | grep 'docs' || true)
          perf_messages=$(echo "$commit_messages" | grep 'perf' || true)
          echo "::set-output name=feat_messages::${feat_messages[@]}"
          echo "::set-output name=fix_messages::${fix_messages[@]}"
          echo "::set-output name=docs_messages::${docs_messages[@]}"
          echo "::set-output name=perf_messages::${perf_messages[@]}"

      - name: 获取当前分支名
        id: get_branch_name
        run: |
          branch_name=$(git rev-parse --abbrev-ref HEAD)
          echo "::set-output name=branch_name::$branch_name"

      - name: 发布说明
        id: generate_release_notes
        run: |
            # 提取提交消息分类
            feat_messages=("${{ steps.extract_commit_messages.outputs.feat_messages }}")
            fix_messages=("${{ steps.extract_commit_messages.outputs.fix_messages }}")
            docs_messages=("${{ steps.extract_commit_messages.outputs.docs_messages }}")
            perf_messages=("${{ steps.extract_commit_messages.outputs.perf_messages }}")
        
            # 生成发布说明的Markdown字符串
            release_notes="> 请查看 [更新日志](./CHANGELOG.md) 获取所有变更详情。  \n## 更新内容：  \n"
        
            if [[ -n "$feat_messages" ]]; then
              release_notes="$release_notes\n### ✨ Features | 新功能:  \n"
              for message in "${feat_messages[@]}"; do
                release_notes="$release_notes\n- $message"
              done
            fi
        
            if [[ -n "$fix_messages" ]]; then
              release_notes="$release_notes\n### 🐛 Bug Fixes | Bug 修复:  \n"
              for message in "${fix_messages[@]}"; do
                release_notes="$release_notes\n- $message"
              done
            fi
        
            if [[ -n "$docs_messages" ]]; then
              release_notes="$release_notes\n### ✏️ Documentation | 文档:  \n"
              for message in "${docs_messages[@]}"; do
                release_notes="$release_notes\n- $message"
              done
            fi
        
            if [[ -n "$perf_messages" ]]; then
              release_notes="$release_notes\n### ⚡ Performance Improvements | 性能优化:  \n"
              for message in "${perf_messages[@]}"; do
                release_notes="$release_notes\n- $message"
              done
            fi
            echo "::set-output name=release_notes::$release_notes"
        

      - name: 写入生成的发布说明到 changelog.md
        run: |
              echo -e "${{ steps.generate_release_notes.outputs.release_notes }}" > changelog.md
              cat changelog.md

      - name: 创建标签的发布
        id: release_tag
        uses: ncipollo/release-action@v1
        with:
          generateReleaseNotes: "false"  # 禁用自动生成发布说明
          bodyfile: changelog.md

```

### 发布文档到github pages

监听标签的推送，更新代码、初始化环境、打包好文档后，用`JamesIves/github-pages-deploy-action@v4.4.1`提交产物到仓库设置的指定分支。

```yaml
name: Deploy VitePress site to Github Pages

on:
  push:
    branches:
      - release

jobs:
  deploy-and-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v4


      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - uses: pnpm/action-setup@v4
        name: Install pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build Site
        run: pnpm build:docs

      - name: Deploy for Github 🚀
        uses: JamesIves/github-pages-deploy-action@v4.4.1
        with:
          branch: gh-pages
          folder: docs/.vitepress/dist
          # enable single-commit to reduce the repo size
          single-commit: true
          clean: true
```

