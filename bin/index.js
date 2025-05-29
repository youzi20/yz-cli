#!/usr/bin/env node

import { existsSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("❌ 请传入模块路径，例如：ui/Button 或 module/Task");
  process.exit(1);
}

const inputPath = args[0]; // 例如 ui/Button
const [type, name] = inputPath.split("/");

if (!type || !name) {
  console.error("❌ 输入格式错误，正确格式为 ui/ComponentName 或 module/ModuleName");
  process.exit(1);
}

const TYPE_MAP = {
  ui: {
    label: "UI 组件",
    repo: "youzi20/yz-cli/templates/ui",
    destDir: "src/components",
  },
  module: {
    label: "业务模块",
    repo: "youzi20/yz-cli/templates/modules",
    destDir: "src/modules",
  },
};

const config = TYPE_MAP[type];
if (!config) {
  console.error(`❌ 不支持的类型：${type}，支持 ui 或 module`);
  process.exit(1);
}

const dest = resolve(process.cwd(), config.destDir, name);

if (existsSync(dest)) {
  console.error(`❌ 目标目录已存在: ${dest}`);
  process.exit(1);
}

const remotePath = `${config.repo}/${name}`;
console.log(`🚀 正在从 GitHub 拉取模板: ${remotePath}`);
execSync(`npx degit ${remotePath} "${dest}"`, { stdio: "inherit" });

console.log(`✅ 成功复制 ${config.label}：${name} 到 ${dest}`);
