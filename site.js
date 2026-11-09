(() => {
  const languageButton = document.querySelector(".language-toggle");
  const cards = document.querySelectorAll(".sample-card");
  const dialog = document.querySelector(".style-dialog");
  const dialogTitle = document.querySelector("#dialog-title");
  const dialogVideo = document.querySelector(".dialog-video");
  const dialogOriginal = document.querySelector(".dialog-original");
  const dialogError = document.querySelector(".video-error");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let language = "zh";
  let activePreview = null;

  try {
    language = localStorage.getItem("seqvio_studio_language") === "en" ? "en" : "zh";
  } catch {
    // Language switching remains available without storage.
  }

  const setLanguage = (next) => {
    language = next;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
      element.textContent = element.dataset[language];
    });
    document.querySelectorAll("img[data-zh-alt][data-en-alt]").forEach((image) => {
      image.alt = image.getAttribute("data-" + language + "-alt");
    });
    document.querySelectorAll("[data-zh-href][data-en-href]").forEach((element) => {
      element.setAttribute("href", element.getAttribute("data-" + language + "-href"));
    });
    document.title = language === "zh"
      ? "Seqvio Studio — 想象，即将上演"
      : "Seqvio Studio | Vision — Poised for its premiere.";
    if (languageButton) {
      languageButton.textContent = language === "zh" ? "EN" : "中文";
      languageButton.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换为中文");
    }
    try {
      localStorage.setItem("seqvio_studio_language", language);
    } catch {
      // Preference persistence is optional.
    }
  };

  const stopPreview = () => {
    if (!activePreview) return;
    activePreview.pause();
    activePreview.classList.remove("is-playing");
    activePreview = null;
  };

  cards.forEach((card) => {
    const preview = card.querySelector(".sample-preview");

    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch" || reducedMotion.matches || navigator.connection?.saveData || document.hidden || dialog?.open) return;
      stopPreview();
      activePreview = preview;
      if (!preview.hasAttribute("src")) preview.src = card.dataset.video;
      preview.play().catch(() => {
        // Keep the poster visible if muted playback is unavailable.
      });
    });

    card.addEventListener("pointerleave", () => {
      if (activePreview === preview) stopPreview();
    });

    preview.addEventListener("playing", () => {
      if (activePreview === preview) preview.classList.add("is-playing");
    });

    preview.addEventListener("error", () => {
      if (activePreview === preview) stopPreview();
    });

    if (!dialog || typeof dialog.showModal !== "function" || !dialogVideo) return;
    card.setAttribute("aria-haspopup", "dialog");
    card.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      stopPreview();
      dialogError.hidden = true;
      dialogTitle.textContent = card.querySelector(".sample-name").textContent;
      dialogOriginal.href = card.href;
      dialogVideo.src = card.dataset.video;
      dialog.showModal();
      dialogVideo.play().catch(() => {
        // Native controls remain available if playback requires another gesture.
      });
      window.seqvioAnalytics?.record("sample_open");
    });
  });

  document.querySelector(".dialog-close")?.addEventListener("click", () => dialog?.close());
  dialogVideo?.addEventListener("error", () => { dialogError.hidden = false; });
  dialog?.addEventListener("close", () => {
    dialogVideo.pause();
    dialogVideo.removeAttribute("src");
    dialogVideo.load();
  });

  reducedMotion.addEventListener?.("change", stopPreview);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopPreview();
  });
  languageButton?.addEventListener("click", () => setLanguage(language === "zh" ? "en" : "zh"));
  setLanguage(language);
})();
