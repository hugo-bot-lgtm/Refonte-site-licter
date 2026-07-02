# Refonte site Licter — Maquette

Maquette multi-pages du nouveau site Licter (charte : Aiglon / Josefin Sans, #13162D, #BEA76B, fond noir).

## Structure
- `index.html` — Accueil (constellation, carte mondiale interactive, flux de veille)
- `use-cases.html` · `technologies.html` · `clients.html` · `offres.html` · `equipe.html` · `blog.html` · `contact.html`
- `assets/css/style.css` — styles partagés
- `assets/js/main.js` — animations (chaque module s'active seulement si la page contient ses éléments)
- `assets/fonts/` — Aiglon Pro (woff2) · `assets/img/` — logo
- `archive/` — ancienne version one-page

## Lancer en local
Ouvrir `index.html` dans un navigateur, ou `python3 -m http.server` à la racine.

Données marquées « fictives » à remplacer par les vraies (équipe, KPIs, vidéos, articles).
