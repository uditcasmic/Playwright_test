const playwright = require("playwright");
const {
  BeforeAll,
  Before,
  After,
  AfterAll,
  Status,
} = require("@cucumber/cucumber");
const fs = require("fs").promises;
const path = require("path");

var { setDefaultTimeout } = require("@cucumber/cucumber");
setDefaultTimeout(900 * 1000);

const chromeOptions = {
  headless: false,
  slowMo: 100,
  channel: "chrome",
};

BeforeAll(async () => {
  console.log("before all ...");
  global.browser = await playwright.chromium.launch(chromeOptions);
});

AfterAll(async () => {
  console.log("after all ...");
  await global.browser.close();
});

Before(async function () {
  console.log("before ...");
  global.context = await global.browser.newContext({
    recordVideo: {
      dir: path.join(__dirname, "videos"),
    },
  });
  global.page = await global.context.newPage();
});

After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    console.log("after fail...");

    const reportsDirectory = "reports";
    const scenarioName = sanitizeFileName(scenario.pickle.name);
    const screenshotFilePath = path.join(
      reportsDirectory,
      `${scenarioName}.png`
    );

    try {
      await fs.mkdir(reportsDirectory, { recursive: true });

      const screenshotBuffer = await global.page.screenshot({
        path: screenshotFilePath,
        fullPage: true,
      });
      this.attach(screenshotBuffer, "image/png");
      console.log(`Screenshot saved to ${screenshotFilePath}`);

      const videoPath = await global.page.video().path();
      await global.page.close();
      await global.context.close();

      console.log(`Video saved at: ${videoPath}`);

      const videoBuffer = await fs.readFile(videoPath);
      this.attach(videoBuffer, "video/webm");
    } catch (error) {
      console.error("Error handling failed scenario resources:", error);
    }
  } else {
    await global.page.close();
    await global.context.close();
  }
});

function sanitizeFileName(fileName) {
  return fileName.replace(/[\\/:"*?<>|]/g, "_");
}
