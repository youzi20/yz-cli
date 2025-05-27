#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { copySync } = require("fs-extra");
const inquirer = require("inquirer");
const degit = require("degit");

const LOCAL_TEMPLATE_ROOT = path.resolve(__dirname, "../templates");
const CACHE_DIR = path.resolve(__dirname, "../.cache/templates");
const GITHUB_REPO = "youzi20/yz-cli/templates"; // 改成你的仓库地址

const TYPE_MAP = {
  ui: {
    label: "基础 UI 组件",
    subdir: "ui",
    destDir: "src/components"
  },
  module: {
    label: "业务功能模块",
    subdir: "modules",
    destDir: "src/modules"
  }
};

async function ensureTemplatesFromGitHub(subdir) {
  const cachePath = path.join(CACHE_DIR, subdir);
  if (!fs.existsSync(cachePath)) {
    console.log(`🌐 正在从 GitHub 拉取模板 ${subdir} ...`);
    const emitter = degit(`${GITHUB_REPO}/${subdir}`, {
      cache: true,
      force: true,
      verbose: false
    });
    await emitter.clone(cachePath);
  }
  return cachePath;
}

async function main() {
  const { type } = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "请选择要添加的类型：",
      choices: Object.entries(TYPE_MAP).map(([key, value]) => ({
        name: value.label,
        value: key
      }))
    }
  ]);

  const config = TYPE_MAP[type];

  // 优先从 GitHub 获取远程模板
  const templateDir = await ensureTemplatesFromGitHub(config.subdir);

  const available = fs.readdirSync(templateDir).filter((f) =>
    fs.statSync(path.join(templateDir, f)).isDirectory()
  );

  if (available.length === 0) {
    console.error(`❌ 没有可用模板`);
    process.exit(1);
  }

  const { selected } = await inquirer.prompt([
    {
      type: "list",
      name: "selected",
      message: `请选择要添加的${config.label}：`,
      choices: available
    }
  ]);

  const src = path.join(templateDir, selected);
  const dest = path.resolve(process.cwd(), config.destDir, selected);

  if (fs.existsSync(dest)) {
    console.error(`❌ 目标目录已存在: ${dest}`);
    process.exit(1);
  }

  copySync(src, dest);
  console.log(`✅ 已成功添加 ${config.label}：${selected} 到 ${dest}`);
}

main();