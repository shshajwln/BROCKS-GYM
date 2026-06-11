@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --basalt: #26211c;
  --slate: #3b342d;
  --granite: #6e6258;
  --stone: #ece7de;
  --chalk: #fbf9f4;
  --ember: #c97b2d;
  --ember-deep: #a35f1b;
  --moss: #6e7a4f;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--stone);
  color: var(--basalt);
}

/* Faint grain so flat surfaces read as stone, not paper */
.grain {
  background-image: radial-gradient(
      rgba(38, 33, 28, 0.05) 1px,
      transparent 1px
    );
  background-size: 14px 14px;
}

.grain-dark {
  background-image: radial-gradient(
      rgba(251, 249, 244, 0.04) 1px,
      transparent 1px
    );
  background-size: 14px 14px;
}

/* The badge: an eight-sided cut, used for markers, steps and seals */
.octagon {
  clip-path: polygon(
    30% 0,
    70% 0,
    100% 30%,
    100% 70%,
    70% 100%,
    30% 100%,
    0 70%,
    0 30%
  );
}

/* Visible keyboard focus everywhere */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--ember);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Leaflet container sizing + octagon markers */
.leaflet-container {
  width: 100%;
  height: 100%;
  background: var(--slate);
}

.bg-marker {
  width: 30px;
  height: 30px;
  clip-path: polygon(
    30% 0,
    70% 0,
    100% 30%,
    100% 70%,
    70% 100%,
    30% 100%,
    0 70%,
    0 30%
  );
  border: none;
}

.bg-marker-live {
  background: var(--ember);
}

.bg-marker-coming {
  background: var(--granite);
}

.leaflet-popup-content-wrapper {
  border-radius: 4px;
  background: var(--chalk);
  color: var(--basalt);
}
