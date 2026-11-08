# Apache Casbin Editor (Incubating)

Apache Casbin is an effort undergoing incubation at The Apache Software
Foundation (ASF), sponsored by the Apache Incubator. Incubation is required
of all newly accepted projects until a further review indicates that the
infrastructure, communications, and decision making process have stabilized
in a manner consistent with other successful ASF projects. While incubation
status is not necessarily a reflection of the completeness or stability of
the code, it does indicate that the project has yet to be fully endorsed by
the ASF.

[![Build and Deploy](https://github.com/apache/casbin-editor/actions/workflows/master.yml/badge.svg)](https://github.com/apache/casbin-editor/actions/workflows/master.yml)
[![Build](https://github.com/apache/casbin-editor/actions/workflows/release.yml/badge.svg)](https://github.com/apache/casbin-editor/actions/workflows/release.yml)
[![Release](https://img.shields.io/github/release/apache/casbin-editor.svg)](https://github.com/apache/casbin-editor/releases/latest)
[![GitHub issues](https://img.shields.io/github/issues/apache/casbin-editor?style=flat-square)](https://github.com/apache/casbin-editor/issues)
[![GitHub forks](https://img.shields.io/github/forks/apache/casbin-editor?style=flat-square)](https://github.com/apache/casbin-editor/network)
[![Sourcegraph](https://sourcegraph.com/github.com/apache/casbin-editor/-/badge.svg)](https://sourcegraph.com/github.com/apache/casbin-editor?badge)
[![License](https://img.shields.io/github/license/apache/casbin-editor?style=flat-square)](https://github.com/apache/casbin-editor/blob/master/LICENSE)
[![Discord](https://img.shields.io/discord/1022748306096537660?logo=discord&label=discord&color=5865F2)](https://discord.gg/S5UjpzGZjN)

Apache Casbin Editor is a web-based Casbin model and policy editor. It's based on Next.js + TypeScript.

Use the Casbin-editor to write your Casbin model and policy in your web browser.
It provides functionality such as syntax highlighting and code completion, just like an IDE for a programming language.

Try it at either:

1. **Apache Casbin Editor**: [https://editor.casbin.org/](https://editor.casbin.org/)
2. Apache Casbin website: [https://casbin.apache.org/editor](https://casbin.apache.org/editor)

## How it works?

Casbin-editor is a pure frontend Javascript project. It uses [node-casbin](https://github.com/apache/casbin-node-casbin) to perform policy enforcement. It's notable that node-casbin can be used either in frontend Javascript or Node.js.

This project can be viewed as an example for using node-casbin in the browser.

Node.js enforcement runs locally in the browser. The other engines send the
entered model, policy and requests to the selected remote backend (by default,
`cli.casnode.com`). Use synthetic examples when comparing remote engines, or
select a backend you control before entering confidential policy data.

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

If the packaged app cannot load the local `out/` bundle, it falls back to loading **https://editor.casbin.org/** in the window.

## Release preparation

See [RELEASING.md](RELEASING.md) for source candidates, independent approval and
promotion of the signed originals. A workflow artifact or historical GitHub
download is not evidence of approval for a new Apache release.
