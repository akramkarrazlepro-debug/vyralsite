# Vyral Agency — Site web

Site vitrine inspiré de [House of Shafaq](https://www.houseofshafaq.com/), aux couleurs **bleues** et entièrement en **français** pour **Vyral Agency**.

## Contenu

- **Accueil** : hero avec titre animé, sous-titre et CTA (Appeler / Demander un rappel)
- **Showreel** : section dédiée à la vidéo showreel (placeholder à remplacer par une vraie vidéo)
- **Services** : pré-production, production, post-production
- **Types de vidéo** : YouTube, documentaires, publicités, shorts/reels, UGC, drone/FPV
- **À propos** : présentation de l’agence
- **Témoignages** : carousel avec flèches et points
- **Footer** : CTA, liste de services (VFX, tournage, etc.), contact et liens

## Animations

- Réapparition des blocs au scroll (reveal)
- Hero : lignes de titre qui montent, sous-titre et CTA en fade-in
- Indicateur de scroll animé
- Header qui change au scroll (fond + bordure)
- Cartes services / types de vidéo : léger lift au survol
- Carousel témoignages : transition fluide entre les slides

## Couleurs (thème bleu)

- Primaire : `#0ea5e9` (bleu)
- Accent : `#06b6d4` (cyan)
- Fond : `#0a0a0f`, cartes : `#111118`

## Lancer le site

Ouvrir `index.html` dans un navigateur, ou servir le dossier avec un serveur local :

```bash
# Python 3
python3 -m http.server 8000

# puis ouvrir http://localhost:8000
```

## Fichiers

- `index.html` — structure de la page
- `css/styles.css` — styles et animations
- `js/main.js` — menu mobile, scroll reveal, carousel témoignages, smooth scroll

Pour intégrer une **vraie vidéo showreel**, remplacer le bloc `.showreel-placeholder` par une balise `<video>` ou un iframe (YouTube/Vimeo).
