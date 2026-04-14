# Skill: Write Documentation

## Agent
`@content`

## Objective
Produce all user-facing copy, developer documentation, and SEO metadata for the application.

## Instructions

### 1. README.md (Project Root)
Write a comprehensive README following this structure:
```markdown
# [Project Name]
> [One-line tagline]

## ✨ Features
## 🚀 Quick Start
## 📖 Usage
## 🏗️ Architecture
## 🔧 Configuration (.env variables explained)
## 📦 Deployment
## 🤝 Contributing
## 📄 License
```

### 2. In-App Copy
- Review all frontend files in `app_build/` for placeholder text (e.g., "Lorem ipsum", "TODO", "Placeholder").
- Replace ALL placeholder text with real, purpose-fit copy.
- Ensure all error messages are human-friendly (not raw error codes).
- Ensure all empty states have helpful messages (e.g., "No tasks yet! Click '+' to add your first one.").

### 3. SEO Metadata (for every HTML page)
- Add `<title>` — unique, descriptive, 50-60 chars.
- Add `<meta name="description">` — compelling, 150-160 chars.
- Add Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`).
- Verify one `<h1>` per page with proper `<h2>`/`<h3>` hierarchy.

### 4. CHANGELOG.md (Project Root)
Create an initial CHANGELOG:
```markdown
# Changelog
## [1.0.0] - YYYY-MM-DD
### Added
- Initial release
- [List all key features]
```

### 5. .env.example
Ensure a clean `.env.example` exists in the project root with all required environment variables listed with placeholder values and brief comments:
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Auth
JWT_SECRET=your_secret_here
```

### Output
- `README.md` → project root
- `CHANGELOG.md` → project root
- `.env.example` → project root
- All in-app copy and SEO tags → applied directly to `app_build/`
- Report: "Documentation complete."
