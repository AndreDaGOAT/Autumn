
diff --git a/script.js b/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..57727762880dc4c183936b3b4e531f82e42d39c2
--- /dev/null
+++ b/script.js
@@ -0,0 +1,80 @@
+const memories = [
+  {
+    title: "First Leaf Pile Jump",
+    date: "October 2008",
+    caption: "Replace this placeholder with a favorite childhood photo and a short story about the moment.",
+    image: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&w=1200&q=80",
+    alt: "A child playing in autumn leaves"
+  },
+  {
+    title: "Backyard Adventures",
+    date: "June 2010",
+    caption: "Use this slide for a sunny backyard memory, a sibling snapshot, or a photo from a family cookout.",
+    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=1200&q=80",
+    alt: "Children running through a grassy field"
+  },
+  {
+    title: "Birthday Wishes",
+    date: "March 2012",
+    caption: "Add a birthday picture here and write down the small details that made the day special.",
+    image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80",
+    alt: "Birthday candles glowing on a cake"
+  },
+  {
+    title: "Holiday Morning",
+    date: "December 2014",
+    caption: "This space is ready for a holiday morning memory, matching pajamas, or a treasured family tradition.",
+    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1200&q=80",
+    alt: "Wrapped holiday gifts near a decorated tree"
+  }
+];
+
+const image = document.querySelector("#memory-image");
+const date = document.querySelector("#memory-date");
+const title = document.querySelector("#memory-title");
+const caption = document.querySelector("#memory-caption");
+const thumbnails = [...document.querySelectorAll(".thumbnail")];
+const toggleButton = document.querySelector('[data-action="toggle"]');
+let currentIndex = 0;
+let isPlaying = true;
+let rotationTimer;
+
+function showMemory(index) {
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
+    thumbnail.style.backgroundImage = `url(${memories[thumbnailIndex].image})`;
+    thumbnail.setAttribute("aria-label", `Show ${memories[thumbnailIndex].title}`);
+    thumbnail.setAttribute("aria-current", String(thumbnailIndex === currentIndex));
+  });
+}
+
+function startRotation() {
+  clearInterval(rotationTimer);
+  rotationTimer = setInterval(() => showMemory(currentIndex + 1), 5000);
+}
+
+function setPlaying(playing) {
+  isPlaying = playing;
+  toggleButton.textContent = isPlaying ? "Pause" : "Play";
+  if (isPlaying) {
+    startRotation();
+  } else {
+    clearInterval(rotationTimer);
+  }
+}
+
+document.querySelector('[data-action="previous"]').addEventListener("click", () => showMemory(currentIndex - 1));
+document.querySelector('[data-action="next"]').addEventListener("click", () => showMemory(currentIndex + 1));
+toggleButton.addEventListener("click", () => setPlaying(!isPlaying));
+thumbnails.forEach((thumbnail, index) => thumbnail.addEventListener("click", () => showMemory(index)));
+
+showMemory(currentIndex);
+startRotation();
