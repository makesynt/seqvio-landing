(() => {
  const storageKey = "seqvio_click_counts_v1";
  const endpoint = document.querySelector('meta[name="seqvio-analytics-endpoint"]')?.content.trim();

  const readCounts = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  };

  const retainLocalCount = (eventName) => {
    const counts = readCounts();
    counts[eventName] = (counts[eventName] || 0) + 1;
    try {
      localStorage.setItem(storageKey, JSON.stringify(counts));
    } catch {
      // Analytics must never interfere with the page's primary actions.
    }
  };

  const campaign = () => {
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(
      ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
        .map((key) => [key, params.get(key)])
        .filter(([, value]) => value),
    );
  };

  const record = (eventName, details = {}) => {
    retainLocalCount(eventName);
    if (!endpoint) return;

    const payload = JSON.stringify({
      event: eventName,
      path: location.pathname,
      timestamp: new Date().toISOString(),
      referrer: document.referrer ? new URL(document.referrer).hostname : "",
      campaign: campaign(),
      ...details,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      mode: "cors",
    }).catch(() => {});
  };

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-track]");
    if (!target || target.tagName === "VIDEO") return;
    record(target.dataset.track, { destination: target.getAttribute("href") || "" });
  });

  document.querySelectorAll("video[data-track]").forEach((video) => {
    let started = false;
    video.addEventListener("play", () => {
      if (started) return;
      started = true;
      record(`${video.dataset.track}_play`);
    });
    video.addEventListener("ended", () => record(`${video.dataset.track}_complete`));
  });

  window.seqvioAnalytics = { record, getLocalCounts: readCounts };
})();
