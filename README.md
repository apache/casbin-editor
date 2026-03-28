# Casbin-editor

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](#badge)
[![Build and Deploy](https://github.com/casbin/casbin-editor/actions/workflows/master.yml/badge.svg)](https://github.com/casbin/casbin-editor/actions/workflows/master.yml)
[![Build](https://github.com/casbin/casbin-editor/actions/workflows/release.yml/badge.svg)](https://github.com/casbin/casbin-editor/actions/workflows/release.yml)
[![Release](https://img.shields.io/github/release/casbin/casbin-editor.svg)](https://github.com/casbin/casbin-editor/releases/latest)
[![GitHub issues](https://img.shields.io/github/issues/casbin/casbin-editor?style=flat-square)](https://github.com/casbin/casbin-editor/issues)
[![GitHub forks](https://img.shields.io/github/forks/casbin/casbin-editor?style=flat-square)](https://github.com/casbin/casbin-editor/network)
[![Sourcegraph](https://sourcegraph.com/github.com/casbin/casbin-editor/-/badge.svg)](https://sourcegraph.com/github.com/casbin/casbin-editor?badge)
[![License](https://img.shields.io/github/license/casbin/casbin-editor?style=flat-square)](https://github.com/casbin/casbin-editor/blob/master/LICENSE)
[![Discord](https://img.shields.io/discord/1022748306096537660?logo=discord&label=discord&color=5865F2)](https://discord.gg/S5UjpzGZjN)

Casbin-editor is a web-based Casbin model and policy editor. It's based on Next.js + TypeScript.

Use the Casbin-editor to write your Casbin model and policy in your web browser.
It provides functionality such as syntax highlighting and code completion, just like an IDE for a programming language.

Try it at either:

1. **Apache Casbin Editor** (official ASF deployment): [https://casbin-editor.apache.org/](https://casbin-editor.apache.org/)
2. Apache Casbin website: [https://casbin.apache.org/editor](https://casbin.apache.org/editor)

## How it works?

Casbin-editor is a pure frontend Javascript project. It uses [node-casbin](https://github.com/casbin/node-casbin) to perform policy enforcement. It's notable that node-casbin can be used either in frontend Javascript or Node.js.

This project can be viewed as an example for using node-casbin in the browser.

## Website deployment (ASF)

The public site is **not** published with GitHub Pages anymore. CI builds the static Next.js output and pushes it to the repository’s **`asf-site`** branch; Apache Infrastructure then serves it at **https://casbin-editor.apache.org/**.

- **Workflow:** [.github/workflows/master.yml](.github/workflows/master.yml) (`Build and Deploy`)
- **Triggers:** push to `master`, `workflow_dispatch`, and pull requests (PRs only run build; they do not publish)
- **Build:** `yarn install` and `yarn build` (static export to the `out/` directory)
- **ASF metadata:** root [`.asf.yaml`](.asf.yaml) is copied to `out/.asf.yaml` before publish so the published tree includes the file Infra expects
- **Publish:** [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) with `publish_branch: asf-site`, `publish_dir: ./out`, and `force_orphan: true` (each deploy replaces the branch history for a clean site-only tree)

Repository settings for GitHub Pages (if any) are unrelated to this flow; the live editor URL is the ASF domain above.

## For Dev

```shell
yarn install
yarn dev
```

Open browser: http://localhost:3000/

## Production Preview

```shell
yarn build

# Make sure port 3000 is not in use
yarn start
```

Open browser: http://localhost:3000/

## For Electron

This project supports being built as an Electron app:

```shell
yarn install
yarn dist
```

If the packaged app cannot load the local `out/` bundle, it falls back to loading **https://casbin-editor.apache.org/** in the window.
