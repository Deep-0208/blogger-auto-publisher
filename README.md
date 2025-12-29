# 🚀 n8n Blogger Automation System

A complete automation system to **create and publish Blogger posts automatically** using **n8n**. It supports **text + images**, **draft or publish mode**, and **bulk posting** to multiple Blogger blogs.

---

## ✨ What This Project Does

This automation allows you to:

- Send blog content from a **form or webhook**
- Upload images automatically to **Cloudinary**
- Convert structured content blocks into **clean HTML**
- Create **Blogger posts** (draft or published)
- Post the same content to **multiple Blogger blogs**
- Run securely using **n8n (self-hosted or cloud)**

---

## 🧠 Key Features

- ✅ Automated Blogger post creation
- 🖼 Image upload and hosting via **Cloudinary**
- 🧱 Block-based content handling (text + images in correct order)
- 📝 Draft or Publish control
- 📚 Bulk posting to multiple Blogger blog IDs
- 🔐 Secure credential handling
- 🛠 Error-safe HTML generation
- 🌐 Webhook-based (API ready)

---

## 🧰 Tech Stack

- **n8n** – Automation engine
- **Blogger API** – Blog publishing
- **Cloudinary** – Image hosting
- **JavaScript** – Logic and data processing
- **HTML** – Final blog content
- **Webhook / Form** – Input sources

---

## 📂 Project Structure

```
.
├── frontend/
│   └── index.html              # Blog post form UI
│
├── n8n/
│   ├── workflows/              # n8n workflow JSON files
│   └── docs/                   # Workflow explanations
│
├── assets/
│   └── images/                 # Screenshots & demos
│
├── .gitignore                  # Ignored files & secrets
├── README.md                   # Project documentation
└── LICENSE                     # Open-source license
```

---

## ⚙️ How the Automation Works

1. User submits **blog title, content blocks, and images**
2. n8n receives the data through a **secure webhook**
3. Images are uploaded to **Cloudinary**
4. Content blocks are converted into **clean HTML**
5. Blogger API creates the blog post:
   - **Draft** OR **Published**
6. (Optional) The same post is published to **multiple Blogger blogs**

---

## 🔐 Required Credentials

You need to configure the following credentials **inside n8n**:

| Service | Credential Type | Required Fields |
|---------|----------------|-----------------|
| **Blogger** | OAuth2 | Client ID, Client Secret, Access Token |
| **Cloudinary** | API Key | Cloud Name, API Key, API Secret |
| **Webhook** | Secret Token | Webhook URL, Auth Token (optional) |

> ❗ **Important:**  
> All secrets are handled securely in n8n and are **never stored in this repository**.

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/n8n-blogger-automation.git
cd n8n-blogger-automation
```

---

### 2️⃣ Set Up n8n

#### Option A: Self-Hosted n8n

```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Access n8n at: `http://localhost:5678`

#### Option B: n8n Cloud

1. Sign up at [n8n.cloud](https://n8n.cloud)
2. Create a new workspace

---

### 3️⃣ Configure Credentials in n8n

#### Blogger OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Blogger API v3**
4. Create **OAuth 2.0 credentials**
5. Add authorized redirect URI: `https://your-n8n-instance/rest/oauth2-credential/callback`
6. Copy **Client ID** and **Client Secret**
7. In n8n: Add **Blogger OAuth2** credential and authenticate

#### Cloudinary API

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. In n8n: Add **Cloudinary** credential with these values

---

### 4️⃣ Import n8n Workflow

1. Open n8n
2. Click **Import from File**
3. Select workflow JSON from `n8n/workflows/`
4. Configure all credentials
5. Update webhook URLs if needed
6. **Activate** the workflow

---

### 5️⃣ Test the Frontend Form

1. Open `frontend/index.html` in your browser
2. Update the webhook URL to match your n8n instance
3. Fill in blog title, content blocks, and upload images
4. Submit and check your Blogger blog!

---

## 📝 Usage Examples

### Single Blog Post

```json
{
  "title": "My Awesome Blog Post",
  "blogIds": ["1234567890"],
  "isDraft": false,
  "content": [
    {
      "type": "text",
      "content": "<p>This is my introduction paragraph.</p>"
    },
    {
      "type": "image",
      "url": "https://res.cloudinary.com/..."
    },
    {
      "type": "text",
      "content": "<p>More content here.</p>"
    }
  ]
}
```

### Bulk Post to Multiple Blogs

```json
{
  "title": "Cross-Posted Content",
  "blogIds": ["1234567890", "0987654321", "1122334455"],
  "isDraft": false,
  "content": [...]
}
```

---

## 🛡 Security Notes

- ✅ API keys and secrets are not committed to GitHub
- ✅ Sensitive files are ignored using `.gitignore`
- ✅ OAuth is used for Blogger authentication
- ✅ Webhook authentication recommended
- ❌ Never expose API keys in frontend code

### Recommended `.gitignore`

```
# n8n
.n8n/
*.db

# Environment files
.env
.env.local

# Credentials
credentials/
secrets/

# Node modules
node_modules/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## 🐛 Troubleshooting

### Issue: Images not uploading

- Check Cloudinary credentials
- Verify image file size (max 10MB recommended)
- Check image format (JPG, PNG, GIF supported)

### Issue: Blogger API errors

- Verify OAuth credentials are valid
- Check Blog IDs are correct
- Ensure Blogger API is enabled in Google Cloud

### Issue: Webhook not receiving data

- Confirm webhook URL is correct
- Check n8n workflow is activated
- Verify webhook is accessible (not behind firewall)

---

## 📌 Use Cases

- 📰 Bloggers and content creators
- 🎯 SEO and content automation
- 📚 Bulk blog publishing
- 🤖 Automated content distribution
- 📖 Learning real-world n8n workflows

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- 📧 Email: deeppanchal0208@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Deep-0208/n8n-blogger-automation/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/Deep-0208/n8n-blogger-automation/discussions)

---

## 🙏 Acknowledgments

- [n8n](https://n8n.io/) - Awesome automation platform
- [Blogger API](https://developers.google.com/blogger) - Google's blog platform
- [Cloudinary](https://cloudinary.com/) - Image hosting service

---

## 🔗 Useful Links

- [n8n Documentation](https://docs.n8n.io/)
- [Blogger API Reference](https://developers.google.com/blogger/docs/3.0/getting_started)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

**Made with ❤️ by [Your Name]**

⭐ If you find this project helpful, please give it a star on GitHub!
