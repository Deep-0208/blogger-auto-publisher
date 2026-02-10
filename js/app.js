// ===== API CONFIG =====
// All secrets are handled server-side (Cloudflare Worker)
const API_ENDPOINT = "/api/blog";

// ===== Global State =====
let blockCount = 0;

// ===== Utility Functions =====

/**
 * Update block counter display
 */
function updateBlockCounter() {
  const counter = document.getElementById("blockCounter");
  const blocks = document.querySelectorAll(".block");
  const count = blocks.length;
  counter.textContent = `${count} block${count !== 1 ? "s" : ""}`;
}

// ===== Block Management =====

/**
 * Add a new content block
 */
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
  updateBlockCounter();
}

/**
 * Remove block with animation
 */
function removeBlock(btn) {
  const block = btn.closest(".block");
  block.style.animation = "slideOut 0.3s ease-out";

  setTimeout(() => {
    block.remove();
    updateBlockCounter();
  }, 300);
}

/**
 * Change block content type
 */
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

// ===== File Handling =====

/**
 * Show file preview
 */
function showFilePreview(input) {
  const preview = input.nextElementSibling;

  if (input.files.length > 0) {
    const file = input.files[0];
    const sizeKB = (file.size / 1024).toFixed(2);
    preview.textContent = `✓ ${file.name} (${sizeKB} KB)`;
    preview.classList.add("show");
  } else {
    preview.classList.remove("show");
  }
}

// ===== Notifications =====

/**
 * Show toast notification
 */
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

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
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

/**
 * Show published blog links
 */
function showPostLinks(posts) {
  const container = document.getElementById("resultLinks");

  container.innerHTML = `
    <h3>✅ Published Blog Links</h3>
    <div style="margin-top:12px;font-family:monospace;"></div>
  `;

  const list = container.querySelector("div");

  posts.forEach(({ blogId, url }) => {
    if (!url) return;

    const line = document.createElement("div");
    line.textContent = `${blogId} : ${url}`;

    line.style.cssText = `
      margin-bottom:10px;
      padding:8px 10px;
      background:#f7fafc;
      border-radius:6px;
      cursor:pointer;
    `;

    line.onclick = () => {
      navigator.clipboard.writeText(url);
      showToast("Copied to clipboard");
    };

    list.appendChild(line);
  });
}

// ===== Validation =====

function validateTitle() {
  const input = document.getElementById("title");
  const error = document.getElementById("title-error");

  if (!input.value.trim()) {
    input.classList.add("invalid");
    error.classList.add("show");
    return false;
  }

  input.classList.remove("invalid");
  input.classList.add("valid");
  error.classList.remove("show");
  return true;
}

function validateBlogIds() {
  const input = document.getElementById("blogIds");

  if (!input.value.trim()) {
    input.classList.add("invalid");
    showToast("Please enter at least one Blog ID", "error");
    return false;
  }

  input.classList.remove("invalid");
  input.classList.add("valid");
  return true;
}

// ===== Form Reset =====

function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("blogIds").value = "";
  document.getElementById("blocks").innerHTML = "";

  blockCount = 0;
  addBlock();
  addBlock();
}

// ===== Form Submission =====

function submitForm() {
  if (!validateTitle() || !validateBlogIds()) return;

  const formData = new FormData();
  const blocks = [];
  let imageIndex = 0;

  formData.append("title", document.getElementById("title").value.trim());

  document.querySelectorAll(".block").forEach(block => {
    const type = block.querySelector("select")?.value;

    if (type === "text") {
      const textarea = block.querySelector("textarea");
      if (textarea?.value.trim()) {
        blocks.push({ type: "text", value: textarea.value.trim() });
      }
    }

    if (type === "image") {
      const input = block.querySelector('input[type="file"]');
      if (input?.files.length) {
        const key = `image_${imageIndex}`;
        formData.append(key, input.files[0]);
        blocks.push({ type: "image", fileKey: key });
        imageIndex++;
      }
    }
  });

  if (!blocks.length) {
    showToast("Please add at least one content block", "error");
    return;
  }

  const blogIds = document
    .getElementById("blogIds")
    .value.split(",")
    .map(id => id.trim())
    .filter(Boolean);

  formData.append("blocks", JSON.stringify(blocks));
  formData.append("blogIds", JSON.stringify(blogIds));

  const btn = document.querySelector(".btn-publish");
  btn.classList.add("loading");
  btn.disabled = true;

  fetch("http://localhost:5678/webhook-test/blog-post-production", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error(data.message);
      showToast(data.message || "Post published successfully!");
      if (Array.isArray(data.posts)) showPostLinks(data.posts);
      resetForm();
    })
    .catch(err => showToast(err.message || "Request failed", "error"))
    .finally(() => {
      btn.classList.remove("loading");
      btn.disabled = false;
    });
}

// ===== Init =====

function init() {
  document.getElementById("title").addEventListener("input", validateTitle);
  document.getElementById("blogIds").addEventListener("input", validateBlogIds);
  addBlock();
  addBlock();
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();
