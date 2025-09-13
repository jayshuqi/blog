---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: Publish a Uniapp Component Library
slug: publish-a-component-library
featured: false
draft: true
tags:
  - component
  - uniapp
description:
  Basic of publishing a uniapp component library
---

## Initialization

Run the following command to create a project:
```shell
https://uniapp.dcloud.net.cn/quickstart-cli.html#%E5%88%9B%E5%BB%BAuni-app
```

### Project Structure

Create a `uni_modules` folder in the `src` directory at the project root. For the internal structure of this folder, refer to the [official documentation](https://uniapp.dcloud.net.cn/plugin/uni_modules.html#%E9%9D%9E%E9%A1%B9%E7%9B%AE%E6%8F%92%E4%BB%B6%E7%9A%84uni-modules).
The structure of the `package.json` file inside should also follow the [official documentation](https://uniapp.dcloud.net.cn/plugin/uni_modules.html#package-json).

#### Configurable Options in `package.json`

[vetur](https://vuejs.github.io/vetur/guide/component-data.html#other-frameworks),[web-types](https://github.com/JetBrains/web-types),


## Publishing

Use GitHub workflow by creating a `.yml` file that listens for pushed tags and executes the following steps:
1. Checkout the repository.
2. Set up Node.js (requires specifying the node version and registry-url).
3. Install dependencies using `npm install`.
4. Copy components and other files to the `lib` folder (as defined in `package.json`).
5. Enter the `lib` folder and run `npm publish` (this requires setting the `NODE_AUTH_TOKEN` environment variable).

> Each `run` command executes in an independent shell, so the `cd lib` and `npm publish` commands should be run in the same step.

### Executing Script Files
Install and run with `esno`.

For example:
```
esno ./scripts/demo.ts
```

// todo

Suppose you have a Vue component library for UniApp, with documentation built using VitePress. Here are best practices for building and publishing your library.

## dependencies

- `inquirer`. Interactive command for selecting patch, minor or major version.
- `standard-version`. Standardize the component library version, generate the changelog of new version and create the git tag for new version.

## publish
1. Define `files` field in package.json and other basic info that is required.
2. Use `inquirer` and `standard-version` to update the version, generate the changelog in `CHANGELOG.md` file and create a git tag named current version.
3. Copy the content of this version in `CHANGELOG.md` to changelog in uniapp component folder and changelog in document folder.
4. Update the `version` field in package.json in uniapp component folder
5. Generate typescript declaration files for global css variable config component
6. Commit changed files in git, create a tag named current version and push to remote
7. Create a npm publish action which is listen on tags pushed.
8. Create a git release action which is listen on tags pushed.

## project structure

```
-uni-library
    -.github
        -workflows
            -npm-publish.yml
            -github-relase.yml
            -deploy-github-document.yml
    -docs
    -scripts
    -src
        -uni_modules
        -App.vue
        -main.ts
        -manifest.json
        -pages.json
    -CHANGELOG.md
    -package.json
```

## vitepress


### deploy vitepress on github pages
create a yml file
1. listen on branches pushed
2. checkout
3. setup nodejs, install pnpm, install dependencies and build docs
4. use `JamesIves/github-pages-deploy-action@v4.4.1`, commit docs build files to the branch that set in github config.

## github release
create a yml file.
1. listen on tags pushed.
2. checkout
3. get current and last tag
4. get commit messages between these two tags, feat/fix/docs/perf messages.
5. Concatenate changelog strings by feature/fix/docs/perf classification and overwrite the changelog file.
6. use `ncipollo/release-action@v1` to release tags.

### npm publish
create a yml file.
1. listen on tags pushed.
2. checkout.
3. setup nodejs, install pnpm, install dependencies.
4. use `components-helper` to generate attributes.json, tags.json and web-types.json.(for type prompt of ide)
5. copy components and other files to lib folder(define in package.json).

#### build types steps
get paths of all component docs file. use methods of `components-helper` to parse docs file.
assign fileName, path and four core properties: props, events, slots and directives to parsed content.

##### parse

there are two kinds of structure of docs file. `# component name\n description\n ## some example name\n example ## (
props, events, slots or directives)\n (props, events, slots or directives)content` and
`# component name\n description\n ## some example name\n example ## (child component1)(props, events, slots or
directives)\n (child component1)(props, events, slots or directives)content\n ## (child component2)(props, events, slots
or directives)\n (child component2)(props, events, slots or directives)content`.

##### assign
the structure of parsed content would be like this:

```
// result of parse method of compoents-helper
{
  //   table
  // four core properties and its value in table
  // if there are child component, object will have a children property
  children?: [
      {
          path, fileName, title, description, props, events, slots, directives
      }
  ]
}
```

can be found in [vetur](https://github.com/tolking/components-helper/blob/main/src/vetur.ts) method


#### notice
`sync` method of `fast-glob` can get file name array in a directory by regex.

`read`, `parse`, `vetur`, `webTypes`, `write` of `components-helper` is useful for building types.

`read`: get file content
`parse`: parse file content and get structured content
