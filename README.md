# TailorLead – Sourcing Intelligence

Landing page premium avec animations corporate-tech interactives.

## 🚀 Démarrage

```bash
npm install
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173)

## 🎨 Design & Animations

### Header
- **TailorLead** en haut à gauche (28px, bold, tracking-wide)
- Slogan : "Where Data Becomes Deal Flow." (white/60)

### Fond Animé (PremiumNetwork)
- Réseau de particules avec lignes argentées (#8ba8c7)
- **Pulses lumineux** qui voyagent depuis les bords vers le centre (couleur: #4dafff)
- 4 emitters positionnés aux 4 bords de l'écran
- Vitesse des pulses augmente de 20% quand l'utilisateur tape

### SearchBar Interactif

#### États:
1. **IDLE** (repos)
   - Bordure blanche 20% opacity
   - Fond transparent avec blur
   
2. **TYPING** (utilisateur tape)
   - Bordure bleue électrique (#4dafff)
   - Animation pulse sur la bordure (glow bleu)
   - Pulses du fond accélèrent de 20%
   
3. **SUBMIT** (appui sur Enter)
   - **Blue Beam**: rayon vertical bleu qui descend depuis le prompt
   - **Burst**: 2 cercles qui s'étendent depuis le prompt

## 📁 Structure

```
src/
├── components/
│   ├── PremiumNetwork.tsx    # Fond animé tsParticles avec emitters
│   └── SearchBar.tsx          # Barre de recherche avec 3 états + animations
├── pages/
│   └── Landing.tsx            # Page principale (header + searchbar)
├── App.tsx                    # Point d'entrée
└── index.css                  # Animations CSS (pulse-border, beam, burst)
```

## 🎯 Animations CSS

### `animate-pulse-border`
Pulse bleu sur la bordure quand l'utilisateur tape (2s infinite)

### `animate-beam`
Rayon vertical bleu qui descend (700ms, déclenché au submit)

### `animate-burst-1` & `animate-burst-2`
Cercles qui s'étendent depuis le prompt (600ms & 800ms)

## 🔧 Configuration tsParticles

- **Particules principales**: 80 particules blanches/argentées avec liens
- **Emitters**: 4 emitters (top, bottom, left, right) qui génèrent des pulses bleus
- **Direction**: Pulses convergent vers le centre (prompt)
- **Vitesse dynamique**: Contrôlée via prop `pulseSpeed`

## 🎨 Palette Corporate

- Background: `#0d1b2a` (bleu nuit)
- Lignes réseau: `#8ba8c7` (argent/bleu)
- Pulses: `#4dafff` (bleu électrique)
- Texte: `white` / `white/60`

## 📱 Responsive

- Header adaptatif (taille et espacement)
- SearchBar max-width 600px avec padding responsive
- Particules adaptées à toutes les tailles d'écran

