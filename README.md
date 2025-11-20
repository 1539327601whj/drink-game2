# 赛博酒局 (Cyber Drinking Party)

这是一款基于 React + Vite + Google Gemini AI 的赛博朋克风格饮酒游戏网页版。

## 🛠️ 本地运行 (Local Development)

1.  **安装依赖**:
    ```bash
    npm install
    ```

2.  **设置 API Key**:
    在根目录创建一个 `.env` 文件，填入你的 Google Gemini API Key：
    ```env
    API_KEY=你的_GOOGLE_API_KEY_粘贴在这里
    ```

3.  **启动项目**:
    ```bash
    npm run dev
    ```
    打开浏览器访问控制台显示的地址（通常是 http://localhost:5173）。

---

## 🚀 部署到 Vercel (Deploy to Vercel)

最简单的方法是使用 GitHub + Vercel 自动部署。

### 第一步：上传代码到 GitHub
1.  在你的 GitHub 账号上创建一个新仓库（例如 `ai-drinking-game`）。
2.  在本地项目文件夹中运行以下命令：
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/你的用户名/仓库名.git
    git push -u origin main
    ```

### 第二步：在 Vercel 导入项目
1.  注册或登录 [Vercel](https://vercel.com)。
2.  点击 **"Add New..."** -> **"Project"**。
3.  在 "Import Git Repository" 列表中找到刚才创建的 GitHub 仓库，点击 **"Import"**。

### 第三步：配置环境变量 (关键步骤！)
1.  在 Vercel 的 "Configure Project" 页面。
2.  找到 **"Environment Variables"** (环境变量) 区域。
3.  添加一个新的变量：
    *   **Key**: `API_KEY`
    *   **Value**: 你的 Google Gemini API Key (以 `AIza` 开头的那个字符串)
4.  点击 **"Add"**。

### 第四步：部署
1.  点击底部的 **"Deploy"** 按钮。
2.  等待大约 1 分钟，Vercel 会自动构建并部署你的网站。
3.  部署完成后，点击预览图即可访问你的线上游戏！

---

## ⚠️ 关于 API Key 的安全性
由于这是一个纯前端项目，API Key 会在构建时被打包进前端代码中。
建议前往 [Google AI Studio](https://aistudio.google.com/) 的 API Key 设置页面，**限制该 Key 只能被你的 Vercel 域名调用** (HTTP Referrer 限制)，以防止被他人盗用。
