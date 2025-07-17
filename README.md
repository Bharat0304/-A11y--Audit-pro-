# A11y Audit Pro (Accessibility Analyzer)


A comprehensive web accessibility analysis tool that helps identify WCAG compliance issues and makes the web more inclusive for everyone.

## 🚀 Features

### 🎯 Core Functionality
- **Website Scanning**: Analyze any website for accessibility issues
- **File Upload**: Scan HTML files directly
- **Real-time Analysis**: Powered by axe-core accessibility engine
- **WCAG Compliance**: Supports WCAG 2.1 AA/AAA standards

### 📊 Rich Reporting
- **Visual Dashboard**: Interactive charts and graphs
- **Detailed Reports**: Issue breakdowns by severity
- **Scan History**: Track progress over time
- **Export Options**: Download reports for sharing

### 🛠 Tools & Integration
- **Browser Extension**: Scan any page you visit
- **Developer Dashboard**: Web-based analysis interface
- **Modern UI**: Built with React and Tailwind CSS

## 🏗 Architecture

### Frontend-First Design (Expandable to Full-Stack)
```
├── client/           # React Dashboard (Tailwind + Redux)
├── extension/        # Browser Extension (Manifest V3)
└── Future: Backend   # Node.js + Express + MongoDB
```

## 🔧 Tech Stack

### Current Implementation
- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Accessibility Engine**: axe-core
- **Browser Extension**: Manifest V3

### Planned Backend Features
- **API**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: Firebase Auth
- **Hosting**: Azure/Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser (Chrome/Edge/Firefox)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd accessibility-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

### Individual Component Development

**React Dashboard:**
```bash
cd client
npm start
```

**Browser Extension:**
```bash
cd extension
# Load unpacked extension in Chrome developer mode
# Point to the /extension folder
```

## 📖 Usage

### Web Dashboard
1. Open `http://localhost:3000`
2. Choose scanning method:
   - Enter URL for same-origin websites
   - Upload HTML file for local analysis
3. View detailed accessibility report

### Browser Extension
1. Install extension in Chrome/Edge
2. Navigate to any website
3. Click extension icon to scan current page
4. View summary or open detailed report

## 🎯 Scan Results

### Issue Categories
- **Violations**: Accessibility issues that need fixing
- **Passes**: Tests that passed successfully
- **Incomplete**: Tests requiring manual review
- **Inapplicable**: Tests not relevant to the content

### Severity Levels
- 🔴 **Critical**: Blocks accessibility completely
- 🟠 **Serious**: Significantly impacts users
- 🟡 **Moderate**: Some impact on usability
- 🟢 **Minor**: Minor inconveniences

## 🛣 Roadmap

### Phase 1: Frontend-Only ✅
- [x] React dashboard with Redux
- [x] Browser extension
- [x] Local scanning capabilities
- [x] Rich reporting and charts

### Phase 2: Backend Integration 🚧
- [ ] Node.js API server
- [ ] MongoDB data persistence
- [ ] User authentication
- [ ] Scan history sync

### Phase 3: Advanced Features 🔮
- [ ] Team collaboration
- [ ] Scheduled scans
- [ ] API integrations
- [ ] AI-powered suggestions

## 🧪 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and extension in dev mode |
| `npm run build` | Build all components for production |
| `npm run dev:client` | Start React dashboard only |
| `npm run build:client` | Build React app |
| `npm run build:extension` | Build browser extension |

### Project Structure
```
accessibility-analyzer/
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store and slices
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Client dependencies
├── extension/
│   ├── manifest.json       # Extension configuration
│   ├── popup.html/js       # Extension popup
│   ├── content.js          # Content script
│   └── background.js       # Service worker
└── package.json            # Root package manager
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### 👨‍💻 Developed By

- Daksh Malhotra — [dakshmalhotra.dev](https://dakshmalhotra.dev)  
- Bharat Kumar

📬 Contact: iamdakshmalhotra@gmail.com

© 2025 Daksh Malhotra & Bharat Kumar. All rights reserved.  
Licensed under the [MIT License](./LICENSE.md).

## 🙏 Acknowledgments

- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing engine
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

## 🆘 Support

- 📧 Email: support@accessibility-analyzer.com
- 💬 Issues: [GitHub Issues](https://github.com/username/accessibility-analyzer/issues)
- 📖 Docs: [Documentation](https://docs.accessibility-analyzer.com)

---

**Making the web accessible for everyone** 🌐♿
