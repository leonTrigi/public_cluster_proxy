const envDecrypt = require('../envDecrypt.js');

const { randomUserAgent } = require('./userAgents');

const stats = {
  total: 0,
  success: 0,
  failures: 0,
  lastError: null,
};

let t, i;

async function _req(urls) {
  i = (i + 1) % urls.length;
  const url = urls[i];

  try {
    stats.total++;
    const myHeaders = {
      'User-Agent': randomUserAgent(),
      'Accept': '*/*'
    };
    const res = await fetch(url, { headers: myHeaders });

    if (res.ok) {
      stats.success++;
    } else {
      stats.failures++;
      stats.lastError = `Non-OK status ${res.status}`;
      console.error(`[HEART] GET ${url} returned status ${res.status}`, i);
    }
  } catch (e) {
    stats.total++;
    stats.failures++;
    stats.lastError = e.message;
    console.error(`[HEART] GET ${url} failed:`, i, e.message);
  }
}

async function startCycler() {
  const response = await fetch(
    "https://gist.githubusercontent.com/leonTrigi/1c586fd04360f7fc7d9c0645ca644e04/raw/78fe6dde5ec467269ca6e7cef781ee3cf68c5015/stf.txt"
  );
  const heartUrls = await response.text();
  const urls = JSON.parse(envDecrypt(process.env.publicClusterKey, heartUrls)).urls;

  stopCycler();
  i = -1;
  _req(urls);

  function cycle() {
    _req(urls);
    const interval =
      Math.floor(Math.random() * (10 - 2 + 1) + 2) * 60 * 1000;
    t = setTimeout(cycle, interval);
  }

  cycle();
  console.log("[HEART Started]", t);
}

function stopCycler() {
  clearTimeout(t);
}

function getStatus() {
  return { ...stats }; // immutability heh
}

module.exports = { startCycler, stopCycler, getStatus };
