# NobleTechInc Landing Page

A cutting-edge, cyberpunk-inspired landing page showcasing multidisciplinary expertise in software engineering, graphic design, sound production, data science, and digital marketing.

## Features

- 🌟 Cyberpunk-inspired design with neon accents and tech grid patterns
- 🎨 Advanced CSS effects including:
  - Glitch animations with configurable timing
  - Neon glow effects
  - Cyber gradients
  - Tech-grid backgrounds
  - Smart hover states with ripple effects
- 📱 Fully responsive layout with mobile-first approach
- ⚡ Optimized performance with Next.js 14
- 🎭 Interactive animations using Framer Motion
- 🔍 SEO optimized with Schema.org markup
- 📊 Analytics integration with Google Tag Manager
- 🌓 Dark mode by default with cyberpunk theme
- 🎵 Interactive sound elements
- 🖼️ Hexagonal grid showcase
- 🚀 Performance-optimized assets

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- GSAP
- Heroicons

## Typography

The site uses a carefully selected combination of fonts for a tech-focused aesthetic:
- **Chakra Petch**: Main display font for headings
- **JetBrains Mono**: Monospace font for body text and code-like elements

## Design System

### Colors
```css
:root {
  --background-rgb: 10, 12, 16;
  --accent-rgb: 0, 225, 244;      /* Neon Cyan */
  --accent-secondary-rgb: 123, 97, 255;  /* Electric Purple */
  --text-primary-rgb: 229, 231, 235;
  --text-secondary-rgb: 156, 163, 175;
}
```

### Effects
- **Neon Glow**: Multi-layered shadow effect for interactive elements
- **Cyber Gradient**: Subtle gradient combining primary and secondary accents
- **Glitch Effect**: Configurable text distortion animation
- **Tech Grid**: Subtle background pattern
- **Glass Effect**: Modern frosted glass effect with cyber gradient

### CSS Classes
- `.tech-text`: Uppercase, spaced text with Chakra Petch font
- `.cyber-text`: Monospace text with underline effect
- `.glitch-text`: Animated glitch effect
- `.glass-effect`: Frosted glass with cyber gradient
- `.btn-primary`, `.btn-secondary`: Cyberpunk-styled buttons

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/narindanoble/nobletechinc.git
   ```

2. Install dependencies:
   ```bash
   cd nobletechinc
   npm install
   ```

3. Create a `.env.local` file and add your environment variables:
   ```
   NEXT_PUBLIC_GTM_ID=your-gtm-id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Theme Customization
- Modify color variables in `src/app/globals.css`
- Adjust animation timings via CSS variables
- Configure glitch effect intensity and timing
- Customize gradient angles and opacity levels

### Component Customization
- Update component styles in their respective files
- Modify Framer Motion animations
- Adjust responsive breakpoints
- Customize interaction effects

### Content Customization
- Update text content in component files
- Modify images in the public directory
- Adjust SEO metadata in `src/app/metadata.ts`
- Configure social links in components

## Performance Optimization

- Images are optimized and served in WebP format
- Fonts are preloaded and self-hosted
- Code splitting and lazy loading implemented
- Critical CSS inlined
- Efficient asset caching
- Optimized animations for reduced CPU usage

## SEO Features

- Schema.org markup for Person and Organization
- OpenGraph tags for social sharing
- Semantic HTML structure
- Optimized meta descriptions
- Mobile-friendly design
- Structured data implementation

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Fallbacks for CSS custom properties
- Responsive design testing across devices

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT © Narinda Noble

## Acknowledgments

- Cyberpunk 2077 for design inspiration
- Blade Runner for color palette inspiration
- Ghost in the Shell for UI elements inspiration
