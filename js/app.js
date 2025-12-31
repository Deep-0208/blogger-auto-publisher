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
 * @param {HTMLButtonElement} btn - Remove button element
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
 * Change block content type (text/image)
 * @param {HTMLSelectElement} select - Select dropdown element
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
 * Show preview for uploaded file
 * @param {HTMLInputElement} input - File input element
 */
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

// ===== Notifications =====

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type ('success' or 'error')
 */
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
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

/**
 * Show multiple post links after successful publishing
 * @param {Array} posts - Array of post objects with url property
 */
function showPostLinks(postsArray) {
  const container = document.getElementById("resultLinks");

  container.innerHTML = `
    <h3>✅ Published Blog Links</h3>
    <div style="margin-top:12px;font-family:monospace;"></div>
  `;

  const list = container.querySelector("div");

  postsArray.forEach(({ blogId, url }) => {
    const line = document.createElement("div");

    line.style.marginBottom = "10px";
    line.style.padding = "8px 10px";
    line.style.background = "#f7fafc";
    line.style.borderRadius = "6px";
    line.style.cursor = "pointer";

    line.textContent = `${blogId} : ${url}`;

    // Click to copy
    line.onclick = () => {
      navigator.clipboard.writeText(`${url}`);
      showToast("Copied to clipboard", "success");
    };

    list.appendChild(line);
  });
}

// ===== Validation =====

/**
 * Validate post title
 * @returns {boolean} - True if valid, false otherwise
 */
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

/**
 * Validate blog IDs input
 * @returns {boolean} - True if valid, false otherwise
 */
function validateBlogIds() {
  const blogIdsInput = document.getElementById("blogIds");
  const value = blogIdsInput.value.trim();

  if (!value) {
    blogIdsInput.classList.add("invalid");
    blogIdsInput.classList.remove("valid");
    showToast("Please enter at least one Blog ID", "error");
    return false;
  } else {
    blogIdsInput.classList.remove("invalid");
    blogIdsInput.classList.add("valid");
    return true;
  }
}

// ===== Form Management =====

/**
 * Reset form to initial state
 */
function resetForm() {
  // Clear title
  const titleInput = document.getElementById("title");
  titleInput.value = "";
  titleInput.classList.remove("valid", "invalid");

  // Clear blog IDs
  const blogIdsInput = document.getElementById("blogIds");
  blogIdsInput.value = "";
  blogIdsInput.classList.remove("valid", "invalid");

  // Hide title error
  document.getElementById("title-error").classList.remove("show");

  // Remove all blocks
  const blocksContainer = document.getElementById("blocks");
  blocksContainer.innerHTML = "";

  // Reset counter
  blockCount = 0;

  // Add default 2 blocks again
  addBlock();
  addBlock();
}

// ===== Form Submission =====

/**
 * Submit form data to API
 */
function submitForm() {
  // Validate inputs
  if (!validateTitle() || !validateBlogIds()) {
    return;
  }

  const title = document.getElementById("title").value.trim();
  const formData = new FormData();
  formData.append("title", title);

  const blocks = [];
  let imageIndex = 0;

  // Collect all block data
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

        imageIndex++;
      }
    }
  });

  // Validate block content
  if (blocks.length === 0) {
    showToast("Please add at least one content block", "error");
    return;
  }

  // Parse and validate blog IDs
  const blogIdsInput = document.getElementById("blogIds").value.trim();
  const blogIds = blogIdsInput
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (blogIds.length === 0) {
    showToast("Please enter valid Blog IDs", "error");
    return;
  }

  // Show loading state
  const publishBtn = document.querySelector(".btn-publish");
  publishBtn.classList.add("loading");
  publishBtn.disabled = true;

  // Append data to FormData
  formData.append("blocks", JSON.stringify(blocks));
  formData.append("blogIds", JSON.stringify(blogIds));

  // Send to API
  fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
    },
    body: formData,
  })
    .then(async (res) => {
      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    })
    .then((data) => {
      showToast(data.message || "Post published successfully!", "success");

      // Show post links if available
      if (data.posts && typeof data.posts === "object") {
        showPostLinks(data.posts);
      }

      // Reset form after successful submission
      resetForm();
    })
    .catch((err) => {
      console.error(err);
      showToast(err.message || "Unauthorized or network error", "error");
    })
    .finally(() => {
      publishBtn.classList.remove("loading");
      publishBtn.disabled = false;
    });
}

// ===== Initialization =====

/**
 * Initialize the application
 */
function init() {
  // Add live validation to title input
  document.getElementById("title").addEventListener("input", function () {
    if (this.value.trim()) {
      this.classList.remove("invalid");
      this.classList.add("valid");
      document.getElementById("title-error").classList.remove("show");
    }
  });

  // Add live validation to blog IDs input
  document.getElementById("blogIds").addEventListener("input", function () {
    if (this.value.trim()) {
      this.classList.remove("invalid");
      this.classList.add("valid");
    }
  });

  // Add default 2 blocks
  addBlock();
  addBlock();
}

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
