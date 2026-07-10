diff --git a/script.js b/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..83b8b0f70ffb19eb4e649c1420a6d75e09c034d1
--- /dev/null
+++ b/script.js
@@ -0,0 +1,127 @@
+const fallbackMemories = [
+  {
+    title: "First Leaf Pile Jump",
+    date: "October 2008",
+    caption: "Replace this placeholder with a favorite childhood photo and a short story about the moment.",
+    image: "photos/memory-1.svg",
+    alt: "A child playing in autumn leaves"
+  },
+  {
+    title: "Backyard Adventures",
+    date: "June 2010",
+    caption: "Use this slide for a sunny backyard memory, a sibling snapshot, or a photo from a family cookout.",
+    image: "photos/memory-2.svg",
+    alt: "Children running through a grassy field"
+  },
+  {
+    title: "Birthday Wishes",
+    date: "March 2012",
+    caption: "Add a birthday picture here and write down the small details that made the day special.",
+    image: "photos/memory-3.svg",
+    alt: "Birthday candles glowing on a cake"
+  },
+  {
+    title: "Holiday Morning",
+    date: "December 2014",
+    caption: "This space is ready for a holiday morning memory, matching pajamas, or a treasured family tradition.",
+    image: "photos/memory-4.svg",
+    alt: "Wrapped holiday gifts near a decorated tree"
+  }
+];
+
+const image = document.querySelector("#memory-image");
+const date = document.querySelector("#memory-date");
+const title = document.querySelector("#memory-title");
+const caption = document.querySelector("#memory-caption");
+const thumbnailStrip = document.querySelector(".memory-strip");
+const toggleButton = document.querySelector('[data-action="toggle"]');
+let memories = [];
+let thumbnails = [];
+let currentIndex = 0;
+let isPlaying = true;
+const rotationDelay = 5000;
+let rotationTimer;
+
+function normalizeMemory(memory, index) {
+  return {
+    title: memory.title || `Memory ${index + 1}`,
+    date: memory.date || "Childhood memory",
+    caption: memory.caption || "Add a caption for this childhood memory.",
+    image: memory.image,
+    alt: memory.alt || memory.title || `Childhood memory ${index + 1}`
+  };
+}
+
+async function loadMemories() {
+  try {
+    const response = await fetch("photos/manifest.json", { cache: "no-store" });
+    if (!response.ok) {
+      throw new Error("Photo manifest could not be loaded.");
+    }
+
+    const manifest = await response.json();
+    const manifestMemories = manifest.filter((memory) => memory.image).map(normalizeMemory);
+    memories = manifestMemories.length > 0 ? manifestMemories : fallbackMemories;
+  } catch (error) {
+    console.warn("Using fallback memories:", error);
+    memories = fallbackMemories;
+  }
+}
+
+function buildThumbnails() {
+  thumbnailStrip.innerHTML = "";
+  thumbnails = memories.map((memory, index) => {
+    const thumbnail = document.createElement("button");
+    thumbnail.className = "thumbnail";
+    thumbnail.type = "button";
+    thumbnail.style.backgroundImage = `url(${memory.image})`;
+    thumbnail.setAttribute("aria-label", `Show ${memory.title}`);
+    thumbnail.addEventListener("click", () => showMemory(index));
+    thumbnailStrip.append(thumbnail);
+    return thumbnail;
+  });
+}
+
+function showMemory(index, resetAutoRotation = true) {
+  currentIndex = (index + memories.length) % memories.length;
+  const memory = memories[currentIndex];
+
+  image.src = memory.image;
+  image.alt = memory.alt;
+  date.textContent = memory.date;
+  title.textContent = memory.title;
+  caption.textContent = memory.caption;
+
+  thumbnails.forEach((thumbnail, thumbnailIndex) => {
+    thumbnail.setAttribute("aria-current", String(thumbnailIndex === currentIndex));
+  });
+
+  if (isPlaying && resetAutoRotation) {
+    scheduleNextRotation();
+  }
+}
+
+function scheduleNextRotation() {
+  clearTimeout(rotationTimer);
+  rotationTimer = setTimeout(() => showMemory(currentIndex + 1), rotationDelay);
+}
+
+function setPlaying(playing) {
+  isPlaying = playing;
+  toggleButton.textContent = isPlaying ? "Pause auto-rotation" : "Play auto-rotation";
+  toggleButton.setAttribute("aria-pressed", String(isPlaying));
+  if (isPlaying) {
+    scheduleNextRotation();
+  } else {
+    clearTimeout(rotationTimer);
+  }
+}
+
+document.querySelector('[data-action="previous"]').addEventListener("click", () => showMemory(currentIndex - 1));
+document.querySelector('[data-action="next"]').addEventListener("click", () => showMemory(currentIndex + 1));
+toggleButton.addEventListener("click", () => setPlaying(!isPlaying));
+
+loadMemories().then(() => {
+  buildThumbnails();
+  showMemory(currentIndex);
+});
