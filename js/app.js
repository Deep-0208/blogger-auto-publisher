let blockCount = 0;

/* ➕ Add block */
function addBlock() {
  blockCount++;

  const block = document.createElement("div");
  block.className = "block";

  block.innerHTML = `
    <div class="block-header">
      <strong>Block ${blockCount}</strong>
      <button class="btn-remove" onclick="removeBlock(this)">❌ Remove</button>
    </div>

    <label>Block Type</label>
    <select onchange="changeType(this)">
      <option value="">Select block type...</option>
      <option value="text">📝 Text Content</option>
      <option value="image">🖼️ Image Upload</option>
    </select>

    <div class="block-content"></div>
  `;

  document.getElementById("blocks").appendChild(block);
}

/* ❌ Remove block with animation */
function removeBlock(btn) {
  const block = btn.closest(".block");
  block.style.animation = "slideOut 0.3s ease-out";
  setTimeout(() => block.remove(), 300);
}

/* Slide out animation */
const style = document.createElement("style");
style.textContent = `
  @keyframes slideOut {
    to {
      opacity: 0;
      transform: translateX(-20px);
    }
  }
`;
document.head.appendChild(style);

/* 🔄 Change block type */
function changeType(select) {
  const container = select.parentElement.querySelector(".block-content");
  container.innerHTML = "";

  if (select.value === "text") {
    container.innerHTML = `
      <textarea placeholder="Enter your text content here..."></textarea>
    `;
  }

  if (select.value === "image") {
    container.innerHTML = `
      <input type="file" accept="image/*" onchange="showFilePreview(this)">
      <div class="file-preview"></div>
    `;
  }
}

/* Show file preview */
function showFilePreview(input) {
  const preview = input.nextElementSibling;
  if (input.files.length > 0) {
    const fileName = input.files[0].name;
    const fileSize = (input.files[0].size / 1024).toFixed(2);
    preview.textContent = `✓ ${fileName} (${fileSize} KB)`;
    preview.classList.add("show");
  } else {
    preview.classList.remove("show");
  }
}

/* Toast notification */
function showToast(message, type = "success") {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✅" : "❌"}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* Validate title */
function validateTitle() {
  const titleInput = document.getElementById("title");
  const errorMsg = document.getElementById("title-error");
  const value = titleInput.value.trim();

  if (!value) {
    titleInput.classList.add("invalid");
    titleInput.classList.remove("valid");
    errorMsg.classList.add("show");
    return false;
  } else {
    titleInput.classList.remove("invalid");
    titleInput.classList.add("valid");
    errorMsg.classList.remove("show");
    return true;
  }
}

/* Live validation */
document.getElementById("title").addEventListener("input", function () {
  if (this.value.trim()) {
    this.classList.remove("invalid");
    this.classList.add("valid");
    document.getElementById("title-error").classList.remove("show");
  }
});

/* Default 2 blocks */
addBlock();
addBlock();

/* 🚀 Submit */
function submitForm() {
  if (!validateTitle()) {
    return;
  }

  const title = document.getElementById("title").value.trim();
  const formData = new FormData();
  formData.append("title", title);

  const blocks = [];

  let imageIndex = 0;

  document.querySelectorAll(".block").forEach((block) => {
    const type = block.querySelector("select")?.value;

    if (type === "text") {
      const textarea = block.querySelector("textarea");
      if (textarea && textarea.value.trim()) {
        blocks.push({
          type: "text",
          value: textarea.value.trim(),
        });
      }
    }

    if (type === "image") {
      const fileInput = block.querySelector('input[type="file"]');
      if (fileInput && fileInput.files.length > 0) {
        const fileKey = `image_${imageIndex}`;
        formData.append(fileKey, fileInput.files[0]);

        blocks.push({
          type: "image",
          fileKey,
        });

        imageIndex++; // 🔥 ONLY increase for images
      }
    }
  });

  if (blocks.length === 0) {
    showToast("Please add at least one content block", "error");
    return;
  }

  // Show loading state
  const publishBtn = document.querySelector(".btn-publish");
  publishBtn.classList.add("loading");
  publishBtn.disabled = true;

  // 🔥 MOST IMPORTANT LINE
  formData.append("blocks", JSON.stringify(blocks));

  fetch("https://lucifer0001.app.n8n.cloud/webhook/blog-post", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      publishBtn.classList.remove("loading");
      publishBtn.disabled = false;

      if (data.success) {
        showToast(data.message || "Post published successfully!", "success");
      } else {
        showToast("Failed to publish post", "error");
      }
    })
    .catch((err) => {
      console.error(err);
      publishBtn.classList.remove("loading");
      publishBtn.disabled = false;
      showToast("Network error. Please try again.", "error");
    });
}
