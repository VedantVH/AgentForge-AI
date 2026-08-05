// AgentForge OS — Automated Screenshot Capture Script
// Takes screenshots of all 9 tabs and saves them to demo/screenshots/
// Run: node scripts/screenshots.mjs

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, "..", "demo", "screenshots");
const BASE_URL = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Ensure screenshots directory exists
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const TABS = [
  { id: "dashboard",    label: "01_Dashboard",         nav: null },
  { id: "workspace",    label: "02_AI_Workspace",       nav: "AI Workspace" },
  { id: "memory",       label: "03_Memory_Timeline",    nav: "Memory" },
  { id: "knowledge",    label: "04_Knowledge_Graph",    nav: "Knowledge" },
  { id: "tasks",        label: "05_Tasks_Goals",        nav: "Tasks & Goals" },
  { id: "agents",       label: "06_AI_Debate_Agents",   nav: "Agents" },
  { id: "gpu",          label: "07_GPU_Monitor",        nav: "GPU Monitor" },
  { id: "analytics",    label: "08_Analytics",          nav: "Analytics" },
  { id: "settings",     label: "09_Settings",           nav: "Settings" },
];

async function takeScreenshots() {
  console.log("🚀 AgentForge OS — Screenshot Capture");
  console.log("=" .repeat(50));

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  // Load the app
  console.log(`\n📡 Loading ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 30000 });
  await sleep(1500);

  // Screenshot each tab
  for (const tab of TABS) {
    try {
      if (tab.nav) {
        // Click the nav button
        await page.evaluate((navLabel) => {
          const buttons = Array.from(document.querySelectorAll("button, a"));
          const btn = buttons.find((b) => b.textContent?.trim().includes(navLabel));
          if (btn) btn.click();
        }, tab.nav);
        await sleep(800); // wait for animation
      }

      const filePath = path.join(SCREENSHOTS_DIR, `${tab.label}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  ✅ ${tab.label}.png`);
    } catch (err) {
      console.error(`  ❌ Failed: ${tab.label} — ${err.message}`);
    }
  }

  // Extra: workspace with a message typed
  try {
    // Navigate to workspace
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent?.trim().includes("AI Workspace"));
      if (btn) btn.click();
    });
    await sleep(600);

    // Type a prompt
    await page.focus("textarea");
    await page.type("textarea", "Prepare me for AMD Software Engineer interview using ROCm documentation", { delay: 5 });
    await sleep(300);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "10_Workspace_With_Prompt.png") });
    console.log("  ✅ 10_Workspace_With_Prompt.png");

    // Click Execute
    const executeBtn = await page.$("button[class*='btn-amd']");
    if (executeBtn) {
      await executeBtn.click();
      await sleep(4000); // wait for agent execution
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "11_Agent_Execution_Stream.png") });
      console.log("  ✅ 11_Agent_Execution_Stream.png");
    }
  } catch (err) {
    console.error(`  ❌ Workspace screenshot failed: ${err.message}`);
  }

  await browser.close();

  console.log("\n" + "=".repeat(50));
  console.log(`📸 Screenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log(`   ${fs.readdirSync(SCREENSHOTS_DIR).length} screenshots captured`);
  console.log("✅ Done!");
}

takeScreenshots().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
