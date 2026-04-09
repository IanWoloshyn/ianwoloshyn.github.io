# Ian J. Woloshyn - Portfolio Website

Professional portfolio website showcasing Computer Engineering projects, experience, and skills.

## 🚀 Features

### Project Showcases
- **Embedded Memory (RAM IP Core)** - Complete VHDL implementation with byte-enable functionality
- **Servo Motor Controller** - FSM-based PWM controller with Nios II integration
- **Breathing Rate Detection System** - DSP project with dedicated media section
- **Additional Projects** - MSP432 Sequencer, Vending Machine Controller, Connect 4

### Interactive Code Display
- Expandable code sections for featured projects
- Tabbed interface for viewing multiple files (VHDL, C, testbenches)
- Syntax-highlighted code blocks
- Smooth toggle animations

### Professional Sections
- About Me with education details
- Work Experience (RS Automation, Johnson & Johnson)
- Technical Skills (Hardware, Software, Professional)
- Community Engagement & Achievements
- Contact Information

### Modern Design
- Dark theme optimized for readability
- Fully responsive (mobile, tablet, desktop)
- Smooth scroll animations
- Interactive navigation with active section highlighting
- Accessibility features (skip links, focus states, reduced motion support)

## 📁 File Structure

```
portfolio/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles and design tokens
├── js/
│   └── main.js         # Interactive functionality
└── projects/
    └── (media files)   # Place project images/videos here
```

## 🎨 Design System

### Colors
- **Primary Accent:** Blue (#3b82f6)
- **Background:** Near-black (#0a0a0a)
- **Text:** Zinc scale (primary, secondary, tertiary)

### Typography
- **Sans-serif:** Inter (Google Fonts)
- **Monospace:** JetBrains Mono (for code)

### Spacing
8pt grid system with tokens: xs (8px), sm (16px), md (24px), lg (32px), xl (48px), 2xl (64px)

## 📝 Adding Content

### Adding Project Media (Breathing Rate Detector)
Replace the media placeholder with your content:

```html
<!-- Replace this in index.html -->
<div class="media-placeholder">
    <!-- Your content here -->
    <img src="projects/breathing-rate-demo.gif" alt="Demo">
    <video controls>
        <source src="projects/breathing-rate-video.mp4" type="video/mp4">
    </video>
</div>
```

### Adding New Code Sections
1. Add a button with `code-toggle` class and unique `data-target`
2. Create a code section with matching ID
3. Add tabs and content divs

Example:
```html
<button class="btn btn-secondary btn-sm code-toggle" data-target="code-myproject">
    View Code
</button>

<div class="code-section" id="code-myproject">
    <div class="code-tabs">
        <button class="code-tab active" data-tab="myproject-main">main.vhd</button>
    </div>
    <div class="code-content active" id="myproject-main">
        <pre><code>-- Your code here</code></pre>
    </div>
</div>
```

### Updating Contact Info
Edit the contact section in `index.html`:
- Email: Update href and display text
- Phone: Update href and display text
- Social Links: Update URLs

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - No frameworks, pure JS
- **Google Fonts** - Inter & JetBrains Mono

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance

- Minimal dependencies
- Optimized animations
- Lazy-loaded sections with Intersection Observer
- Mobile-first responsive design

## 🎯 Key Sections to Customize

1. **Hero Section** - Update title and tagline
2. **About** - Modify objective and description
3. **Experience** - Add/update work history
4. **Projects** - Add code snippets and descriptions
5. **Skills** - Update technical skills
6. **Contact** - Update email, phone, social links

## 📄 License

© 2025 Ian J. Woloshyn. All rights reserved.

## 🔗 Links

- GitHub: https://github.com/ian-woloshyn
- LinkedIn: https://linkedin.com/in/ian-woloshyn
- Current Portfolio: https://ian-woloshyn.github.io/

---

**Built by MiniMax Agent** - January 2025
