// CDP screenshot driver — scrolls past the scroll-hijacking hero via wheel events.
// Usage: node scripts/shot.mjs <outfile> <wheelSteps>
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:3000/";
const OUT = process.argv[2] || "shot.png";
const STEPS = Number(process.argv[3] ?? 0);
const PORT = 9222;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--window-size=1440,900",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--user-data-dir=C:\\Temp\\cdp-shot",
  URL,
]);

let msgId = 0;
function send(ws, method, params = {}) {
  const id = ++msgId;
  return new Promise((resolve) => {
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === id) {
        ws.removeEventListener("message", onMsg);
        resolve(m.result);
      }
    };
    ws.addEventListener("message", onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

try {
  // wait for CDP, find the page target
  let target;
  for (let i = 0; i < 40; i++) {
    await sleep(300);
    try {
      const list = await (await fetch(`http://localhost:${PORT}/json`)).json();
      target = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (target) break;
    } catch {}
  }
  if (!target) throw new Error("no page target");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res) => (ws.onopen = res));

  await send(ws, "Page.enable");
  await send(ws, "Runtime.enable");
  await sleep(2500); // let hero mount + video/poster paint

  // Release the scroll-hijacking hero (needs scrollProgress >= 1).
  for (let i = 0; i < 6; i++) {
    await send(ws, "Input.dispatchMouseEvent", {
      type: "mouseWheel", x: 720, y: 450, deltaX: 0, deltaY: 700,
    });
    await sleep(140);
  }
  await sleep(400);

  // Measure real geometry once the hero has released.
  const measure = await send(ws, "Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const proj = document.querySelector('#projects');
      const hero = document.querySelector('main')?.firstElementChild;
      const rows = document.querySelectorAll('#projects a[href]');
      const r = (el) => el ? el.getBoundingClientRect().top + window.scrollY : null;
      return {
        scrollY: window.scrollY,
        docH: document.documentElement.scrollHeight,
        heroTop: r(hero),
        heroBottom: hero ? hero.getBoundingClientRect().bottom + window.scrollY : null,
        projTop: r(proj),
        firstRowTop: rows[1] ? rows[1].getBoundingClientRect().top + window.scrollY : null,
      };
    })()`,
  });
  console.log("GEOMETRY", JSON.stringify(measure?.result?.value));

  // Scroll to target Y (STEPS interpreted as pixels) and shoot.
  await send(ws, "Runtime.evaluate", {
    expression: `window.scrollTo(0, ${STEPS});`,
  });
  await sleep(600);

  const { data } = await send(ws, "Page.captureScreenshot", { format: "png" });
  writeFileSync(OUT, Buffer.from(data, "base64"));
  console.log("saved", OUT, "at scrollY", STEPS);
} catch (e) {
  console.error("ERR", e.message);
} finally {
  chrome.kill();
  process.exit(0);
}
