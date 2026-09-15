# Hachile Blog

`https://blog.hachile.org` 的 Astro 博客，基于 [Firefly](https://github.com/CuteLeaf/Firefly)。

## 本地开发

需要 Node.js 22.23+ 与 pnpm 11.22。

```bash
pnpm install
pnpm dev
```

## 写文章

```bash
pnpm new-post my-post
```

文章位于 `src/content/posts/`。提交并推送到 `main` 后，GitHub Actions 会自动检查、构建并部署站点。

## 首次发布

1. 在 GitHub 创建公开仓库 `GPDdev/blog.hachile.org`。
2. 将该仓库添加为 `origin`，并推送 `main`。
3. 在仓库 **Settings → Pages** 中将 **Source** 设为 **GitHub Actions**。
4. 在 DNS 服务商添加 CNAME：名称 `blog`，目标 `gpddev.github.io`。
5. 在仓库 **Settings → Pages → Custom domain** 中填写 `blog.hachile.org`。
6. DNS 检查和证书签发完成后开启 **Enforce HTTPS**。

主题代码遵循 Firefly 的 MIT 许可；原作者版权声明见 [LICENSE](LICENSE)。
