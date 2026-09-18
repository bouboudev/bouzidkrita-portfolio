# Homepage V2 — Editorial premium + touches dev Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refonte de la homepage en « editorial premium d'abord, technique en second » : 1 projet à la une + 2 secondaires, hero 2 colonnes avec carte statut, listes à filets, timeline parcours, micro-détails mono/pipeline sobres, sans screenshots, sans terminal/typing/hacker.

**Architecture:** 2 nouveaux composants focalisés (`ProjectSpotlight.astro` avec variant `feature|secondary`, `Pipeline.astro`), styles cantonnés à un bloc V2 dans `global.css` réutilisant les tokens existants, `index.astro` réécrit section par section. Aucune dépendance ajoutée, dark/light via variables existantes.

**Tech Stack:** Astro 7 (statique), Tailwind v4 utilitaires + `src/styles/global.css` maison, TypeScript strict, Content Collections existantes.

**Spec:** Demande utilisateur du 18/09/2026 — direction A comme base + touches B subtiles (métadonnées mono, pipelines utiles, détails outils dev), pas de faux terminal/typing/hacker, sans screenshots, infos professionnelles inchangées, lisibilité et mobile excellents.

## Global Constraints

- Ne modifier que la homepage et ses dépendances directes (`src/pages/index.astro`, `src/components/ProjectSpotlight.astro`, `src/components/Pipeline.astro`, `src/styles/global.css`, retouche mineure `src/components/SectionHead.astro` si besoin) — autres pages héritent des styles sans changement de contenu.
- Aucune dépendance npm ajoutée.
- Aucune info professionnelle inventée : n'utiliser que `SITE`, collections `projects`/`experience`, tableaux `domains`/`now` existants.
- Sans screenshots : visuels = numéro fantôme serif + filets + schémas mono `Pipeline`.
- Interdit : faux terminal, typing effect, curseur clignotant, esthétique hacker, nouvelle palette (tokens actuels uniquement).
- Accessibilité : `html.js` gate pour `.reveal` conservé, `aria-labelledby` valides, pastilles décoratives `aria-hidden`, pas de scroll horizontal mobile.
- Dark/light : chaque nouvelle règle a son pendant `.dark`, contraste texte conservé.

---

## File Structure

- Modify: `src/styles/global.css` — append bloc `/* ————— V2 Editorial premium ————— */` (~150 lignes) : `.v2-une`, `.ghost-num`, `.meta-mono`, `.pipeline`, `.skill-row`, `.timeline`, `.status-card`, `.minibar`, responsive + reduced-motion.
- Create: `src/components/Pipeline.astro` — une responsabilité : rendre un schéma mono `étape → étape` (horizontal desktop, vertical mobile), props `{ steps: string[]; label?: string }`.
- Create: `src/components/ProjectSpotlight.astro` — une responsabilité : fiche projet éditoriale avec variant, props `{ num, title, description, href, meta, tags, highlights?, pipeline?, variant: 'feature' | 'secondary' }`, numéro fantôme `aria-hidden`, `Pipeline` uniquement si `pipeline` non vide.
- Modify: `src/pages/index.astro` — hero 2 colonnes + minibar + sections 01–04 + contact, données `featured[0]` = une, `featured.slice(1,3)` = secondaires, `pipelineBySlug: Record<string,string[]>` pour EasyTravel (2 pipelines réels) et Design System (atomes→molécules→organismes), vide pour les autres.
- Modify (mineur, optionnel) : `src/components/SectionHead.astro` — accepter `class` supplémentaire si besoin d'alignement ; sinon ne pas toucher.

---

### Task 1: Bloc CSS V2 dans global.css

**Files:**
- Modify: `src/styles/global.css` (append at end, ne rien supprimer)
- Test: `npm run build` + `npx tsc --noEmit`

**Interfaces:**
- Consumes: tokens existants (`--color-paper`, `--color-paper-soft`, `--color-ink`, `--color-line`, `--color-gold`, `--color-night*`, `--font-display`, `--font-mono`).
- Produces: classes `.v2-une`, `.ghost-num`, `.meta-mono`, `.pipeline`, `.skill-row`, `.timeline`, `.status-card`, `.minibar` utilisées par les Tasks 2–5.

- [ ] **Step 1: Ajouter le bloc CSS V2 à la fin de global.css**

```css
/* ————— V2 Editorial premium ————— */
.meta-mono {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
}
.v2-une {
  position: relative;
  overflow: clip;
  border: 1px solid var(--color-line);
  border-radius: 1.1rem;
  background: var(--color-paper-soft);
  padding: clamp(1.5rem, 3vw, 2.75rem);
}
.dark .v2-une { border-color: var(--color-night-line); background: var(--color-night-soft); }
.v2-une::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--color-gold);
}
.dark .v2-une::before { background: var(--color-gold-light); }
.ghost-num {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  font-family: var(--font-display);
  font-size: clamp(4rem, 8vw, 7rem);
  line-height: 1;
  color: color-mix(in srgb, var(--color-ink) 7%, transparent);
  pointer-events: none;
  user-select: none;
}
.dark .ghost-num { color: color-mix(in srgb, var(--color-night-ink) 8%, transparent); }
.status-card {
  border: 1px solid var(--color-line);
  border-radius: 1rem;
  padding: 1.25rem 1.4rem;
  background: color-mix(in srgb, var(--color-paper) 60%, white);
}
.dark .status-card { border-color: var(--color-night-line); background: var(--color-night-soft); }
.status-card dt {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
}
.status-card dd { margin: 0.2rem 0 0.8rem; font-size: 0.95rem; font-weight: 600; }
.status-card dd:last-child { margin-bottom: 0; }
.minibar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
  padding: 0.8rem 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-soft);
}
.dark .minibar { border-color: var(--color-night-line); color: var(--color-night-soft-ink); }
.minibar strong { color: var(--color-gold); }
.dark .minibar strong { color: var(--color-gold-light); }
.pipeline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: var(--color-ink-soft);
  border: 1px dashed var(--color-line);
  border-radius: 0.7rem;
  padding: 0.7rem 0.9rem;
  background: color-mix(in srgb, var(--color-paper) 70%, white);
}
.dark .pipeline { color: var(--color-night-soft-ink); border-color: var(--color-night-line); background: transparent; }
.pipeline .pipe-sep { color: var(--color-gold); }
.dark .pipeline .pipe-sep { color: var(--color-gold-light); }
.skill-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.3rem;
  padding: 1.2rem 0;
  border-top: 1px solid var(--color-line);
}
.skill-row:last-child { border-bottom: 1px solid var(--color-line); }
.dark .skill-row { border-color: var(--color-night-line); }
@media (min-width: 640px) {
  .skill-row { grid-template-columns: 1fr auto; align-items: baseline; gap: 1rem; }
  .skill-row .stack { text-align: right; max-width: 22rem; }
}
.timeline { list-style: none; margin: 0; padding: 0; }
.timeline li {
  position: relative;
  padding: 0 0 1.6rem 1.6rem;
  border-left: 1px solid var(--color-line);
  margin-left: 0.4rem;
}
.dark .timeline li { border-color: var(--color-night-line); }
.timeline li::before {
  content: "";
  position: absolute;
  left: -5px;
  top: 0.45rem;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--color-paper);
  border: 2px solid var(--color-gold);
}
.dark .timeline li::before { background: var(--color-night); border-color: var(--color-gold-light); }
.timeline li:last-child { padding-bottom: 0; }
@media (prefers-reduced-motion: reduce) {
  .v2-une, .status-card { transition: none; }
}
```

- [ ] **Step 2: Vérifier que le build passe**

Run: `npm run build 2>&1 | tail -n 6`
Expected: `16 page(s) built`, exit 0.

- [ ] **Step 3: Vérifier les types**

Run: `npx tsc --noEmit 2>&1 | head -n 5`
Expected: sortie vide, exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(home): add V2 editorial CSS block"
```

---

### Task 2: Composant Pipeline.astro

**Files:**
- Create: `src/components/Pipeline.astro`
- Test: build + inspection `dist/index.html` contient `pipe-sep`

**Interfaces:**
- Consumes: classe `.pipeline` de la Task 1.
- Produces: `<Pipeline steps label?>` utilisé par `ProjectSpotlight` (Task 3) et la une EasyTravel (Task 4).

- [ ] **Step 1: Créer le composant**

```astro
---
interface Props {
  steps: string[];
  label?: string;
}

const { steps, label = 'Pipeline' } = Astro.props;
---

{steps.length > 0 && (
  <p class="pipeline" role="note" aria-label={`${label} : ${steps.join(' → ')}`}>
    <span class="meta-mono" aria-hidden="true">{label}</span>
    <span aria-hidden="true" class="pipe-sep">·</span>
    {steps.map((s, i) => (
      <>
        {i > 0 && <span class="pipe-sep" aria-hidden="true">→</span>}
        <span>{s}</span>
      </>
    ))}
    <span class="sr-only">{steps.join(', ')}</span>
  </p>
)}
```

- [ ] **Step 2: Vérifier l'intégration (import temporaire non requis — contrôle syntaxe via build)**

Run: `npm run build 2>&1 | tail -n 3`
Expected: build OK (le composant n'est pas encore utilisé, aucune erreur Astro).

- [ ] **Step 3: Commit**

```bash
git add src/components/Pipeline.astro
git commit -m "feat(home): add Pipeline component"
```

---

### Task 3: Composant ProjectSpotlight.astro

**Files:**
- Create: `src/components/ProjectSpotlight.astro`
- Test: build + `grep` dist

**Interfaces:**
- Consumes: `Pipeline.astro` (`steps: string[]`, `label?: string`), classes `.v2-une`, `.ghost-num`, `.meta-mono` de la Task 1.
- Produces: `<ProjectSpotlight num title description href meta tags highlights? pipeline? pipelineLabel? variant />` utilisé par Task 4.

- [ ] **Step 1: Créer le composant**

```astro
---
import Pipeline from './Pipeline.astro';

interface Props {
  num: string;
  title: string;
  description: string;
  href: string;
  meta: string;
  tags?: string[];
  highlights?: string[];
  pipeline?: string[];
  pipelineLabel?: string;
  variant?: 'feature' | 'secondary';
}

const {
  num, title, description, href, meta, tags = [],
  highlights = [], pipeline = [], pipelineLabel = 'Pipeline',
  variant = 'secondary',
} = Astro.props;
---

{variant === 'feature' ? (
  <article class="v2-une reveal">
    <span class="ghost-num" aria-hidden="true">{num}</span>
    <p class="meta-mono">{meta}</p>
    <h3 class="title-lg mt-3"><a href={href}>{title}</a></h3>
    <p class="muted mt-4 max-w-2xl text-lg leading-relaxed">{description}</p>
    {highlights.length > 0 && (
      <ul class="mt-5 max-w-2xl space-y-2 leading-relaxed">
        {highlights.slice(0, 3).map((h) => <li>→ {h}</li>)}
      </ul>
    )}
    {pipeline.length > 0 && (
      <div class="mt-5 max-w-2xl"><Pipeline steps={pipeline} label={pipelineLabel} /></div>
    )}
    {tags.length > 0 && (
      <ul class="mt-5 flex flex-wrap gap-2" aria-label={`Technologies : ${tags.slice(0, 5).join(', ')}`}>
        {tags.slice(0, 5).map((t) => <li class="chip">{t}</li>)}
      </ul>
    )}
    <p class="mt-6"><a href={href} class="link-accent font-semibold">Lire la fiche projet →</a></p>
  </article>
) : (
  <article class="card reveal relative overflow-clip">
    <span class="ghost-num" aria-hidden="true" style="font-size: 3.5rem;">{num}</span>
    <p class="meta-mono">{meta}</p>
    <h3 class="title-md mt-2"><a href={href}>{title}</a></h3>
    <p class="muted mt-2 text-sm leading-relaxed">{description}</p>
    {tags.length > 0 && (
      <ul class="mt-4 flex flex-wrap gap-2" aria-label={`Technologies : ${tags.slice(0, 4).join(', ')}`}>
        {tags.slice(0, 4).map((t) => <li class="chip">{t}</li>)}
      </ul>
    )}
    <p class="mt-4"><a href={href} class="link-accent text-sm font-semibold">Lire →</a></p>
  </article>
)}
```

- [ ] **Step 2: Build de contrôle**

Run: `npm run build 2>&1 | tail -n 3`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectSpotlight.astro
git commit -m "feat(home): add ProjectSpotlight component"
```

---

### Task 4: Hero + section projets (index.astro, partie 1)

**Files:**
- Modify: `src/pages/index.astro` (hero + minibar + section 01 uniquement ; reste inchangé)
- Test: build + contrôles HTML ci-dessous

**Interfaces:**
- Consumes: `ProjectSpotlight`, `Pipeline` indirect, `SITE`, `featured`, `slugOf`.
- Produces: hero 2 colonnes + minibar + une + 2 secondaires, sans toucher aux sections 02–04 dans cette tâche.

- [ ] **Step 1: Réécrire hero + minibar + section 01**

Remplacer le bloc `<!-- Hero -->...<!-- Projets -->` actuel par :

```astro
<Layout>
  <!-- Hero -->
  <section class="hero-visual">
    <div class="wrap grid grid-cols-1 gap-10 pb-14 pt-16 md:grid-cols-[1.6fr_1fr] md:pt-24">
      <div>
        <p class="eyebrow reveal">{SITE.name} — {SITE.location}</p>
        <h1 class="title-xl reveal mt-5 max-w-3xl">{SITE.role}</h1>
        <p class="reveal mt-6 max-w-2xl text-lg md:text-xl" style="font-family: var(--font-display); font-style: italic;">
          « {SITE.baseline} »
        </p>
        <p class="muted reveal mt-5 max-w-2xl leading-relaxed">
          Je conçois des applications web, je maintiens l’existant, je résous
          des problèmes. Ouvert aux postes dev, support et intégration.
        </p>
        <div class="reveal mt-8 flex flex-wrap gap-4">
          <a href="#selection" class="btn btn-solid">Voir la sélection</a>
          <a href="/contact/" class="btn btn-ghost" data-umami-event="contact-click">Me contacter</a>
        </div>
      </div>
      <aside class="status-card reveal" aria-label="Statut">
        <dl>
          <dt>Disponibilité</dt><dd>CDI / mission</dd>
          <dt>Base</dt><dd>Lille — sur site et remote</dd>
          <dt>Stack</dt><dd class="font-normal">Vue.js · Node.js · TypeScript</dd>
          <dt>Observabilité</dt><dd class="font-normal">Prometheus · Grafana · Loki</dd>
        </dl>
      </aside>
    </div>
    <div class="wrap">
      <p class="minibar reveal" aria-label="En bref">
        <span><strong>3 ans</strong> — Vue.js / Node.js (2022 → 2025)</span>
        <span><strong>Lille</strong> — sur site et remote</span>
        <span><strong>Support</strong> — N2/N3, incidents documentés</span>
      </p>
    </div>
  </section>
  <div class="wrap"><hr class="rule" /></div>

  <!-- Projets -->
  <section class="wrap py-16 md:py-20" aria-labelledby="titre-projets" id="selection">
    <SectionHead index="01" eyebrow="Sélection" title="3 projets qui me résument" headingId="titre-projets" />
    {featured[0] && (
      <div class="mt-8">
        <ProjectSpotlight
          num="01"
          title={featured[0].data.title}
          description={featured[0].data.description}
          href={`/projets/${slugOf(featured[0])}/`}
          meta={`${featured[0].data.category} · ${featured[0].data.status}`}
          tags={featured[0].data.stack}
          highlights={featured[0].data.highlights}
          pipeline={featured[0].id.includes('easytravel') ? ['Docker', 'Telegraf', 'Prometheus', 'Grafana'] : featured[0].id.includes('design-system') ? ['Atomes', 'Molécules', 'Organismes', 'Storybook'] : []}
          pipelineLabel={featured[0].id.includes('easytravel') ? 'Métriques' : 'Architecture'}
          variant="feature"
        />
      </div>
    )}
    <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {featured.slice(1, 3).map((p, i) => (
        <ProjectSpotlight
          num={String(i + 2).padStart(2, '0')}
          title={p.data.title}
          description={p.data.description}
          href={`/projets/${slugOf(p)}/`}
          meta={`${p.data.category} · ${p.data.status}`}
          tags={p.data.stack}
          variant="secondary"
        />
      ))}
    </div>
    <p class="mt-6"><a href="/projets/" class="link-accent font-semibold">Tous les projets →</a></p>
  </section>
```

Ajouter en haut du frontmatter : `import ProjectSpotlight from '../components/ProjectSpotlight.astro';` (garder `EntryRow` car encore utilisé par blog ? non — sur index il ne sera plus utilisé après Task 5 si blog absent ; le garder jusqu'à la Task 5 puis retirer l'import s'il est inutilisé).

- [ ] **Step 2: Build + contrôles**

Run: `npm run build 2>&1 | tail -n 3`
Expected: exit 0.

Run: `python3 -c "
import pathlib,re
h=pathlib.Path('dist/index.html').read_text()
assert 'Voir la sélection' in h, 'CTA manquant'
assert h.count('ghost-num') >= 3, 'numéros fantômes manquants'
assert 'Métriques' in h or 'Architecture' in h, 'pipeline manquant'
assert len(re.findall(r'<h1',h))==1, 'H1 dupliqué'
print('hero+projets OK')
"`
Expected: `hero+projets OK`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): hero editorial + featured project"
```

---

### Task 5: Savoir-faire, parcours, en-ce-moment, contact (index.astro, partie 2)

**Files:**
- Modify: `src/pages/index.astro` (sections 02–04 + contact ; retirer import `EntryRow`/`Icon` si inutilisés)
- Test: build + contrôles + régression visuelle textuelle

**Interfaces:**
- Consumes: classes `.skill-row`, `.timeline` de la Task 1 ; données `domains`, `exps`, `now`, `SITE` existantes.
- Produces: homepage complète V2.

- [ ] **Step 1: Remplacer les sections 02–contact**

```astro
  <div class="wrap"><hr class="rule" /></div>

  <!-- Domaines -->
  <section class="wrap py-16 md:py-20" aria-labelledby="titre-savoir-faire">
    <SectionHead index="02" eyebrow="Savoir-faire" title="Ce que je fais le mieux" headingId="titre-savoir-faire" />
    <div class="mt-8">
      {domains.map((d) => (
        <div class="skill-row reveal">
          <div>
            <h3 class="text-base font-semibold leading-snug"><span class="icon-inline"><Icon name={d.icon} /></span>{d.title}</h3>
            <p class="muted mt-1 text-sm">{d.text}</p>
          </div>
          <p class="stack meta-mono">{d.title.includes('Développement') ? 'Vue.js · Node.js · TS' : d.title.includes('Support') ? 'N2/N3 · incidents · docs' : d.title.includes('Intégration') ? 'DS · a11y · fiabilisation' : 'Docker · Prometheus · Loki'}</p>
        </div>
      ))}
    </div>
  </section>

  <div class="wrap"><hr class="rule" /></div>

  <!-- Parcours -->
  <section class="wrap py-16 md:py-20" aria-labelledby="titre-parcours">
    <SectionHead index="03" eyebrow="Parcours" title="D’où je viens" headingId="titre-parcours" />
    <ol class="timeline mt-8">
      {exps.map((e) => (
        <li class="reveal">
          <p class="meta-mono">{e.data.startDate}{e.data.endDate ? ` → ${e.data.endDate}` : ''} · {e.data.company}</p>
          <h3 class="mt-2 text-base font-semibold leading-snug">{e.data.role}</h3>
        </li>
      ))}
    </ol>
    <p class="mt-6"><a href="/parcours/" class="link-accent font-semibold">Parcours complet →</a></p>
  </section>

  <div class="wrap"><hr class="rule" /></div>

  <!-- En ce moment -->
  <section class="wrap py-16 md:py-20" aria-labelledby="titre-moment">
    <SectionHead index="04" eyebrow="En ce moment" title="Ce que j’explore" headingId="titre-moment" />
    <ul class="mt-6 max-w-2xl space-y-3 leading-relaxed">
      {now.map((item) => (
        <li class="reveal"><span class="icon-inline"><Icon name={item.icon} /></span>{item.text}</li>
      ))}
    </ul>
    <p class="mt-6"><a href="/blog/" class="link-accent font-semibold">Lire mes notes →</a></p>
  </section>

  <div class="wrap"><hr class="rule" /></div>

  <!-- Contact -->
  <section class="wrap py-14 text-center md:py-16" aria-labelledby="titre-contact">
    <p class="eyebrow reveal">Contact</p>
    <h2 class="title-lg reveal mx-auto mt-3 max-w-xl" id="titre-contact">Un poste dev, support ou intégration à pourvoir ?</h2>
    <p class="muted reveal mx-auto mt-4 max-w-xl">Basé à Lille, disponible pour CDI ou mission — sur site et remote.</p>
    <div class="reveal mt-8 flex flex-wrap justify-center gap-4">
      <a href="/contact/" class="btn btn-solid" data-umami-event="contact-click">Me contacter</a>
      <a href={SITE.github} target="_blank" rel="noopener noreferrer" class="btn btn-ghost" data-umami-event="github-click">GitHub ↗</a>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Nettoyer les imports puis build**

Si `EntryRow` n'est plus référencé dans le fichier, supprimer sa ligne d'import. Garder `Icon` (utilisé en 02/04).
Run: `npm run build 2>&1 | tail -n 3`
Expected: exit 0.

Run: `python3 -c "
import pathlib,re
h=pathlib.Path('dist/index.html').read_text()
assert 'skill-row' in h and 'timeline' in h, 'sections V2 manquantes'
assert len(re.findall(r'aria-labelledby=\"([^\"]+)\"',h))>=4
for m in re.finditer(r'aria-labelledby=\"([^\"]+)\"',h):
    assert ('id=\"'+m.group(1)+'\"') in h, m.group(1)
assert len(re.findall(r'<h1',h))==1
print('sections OK')
"`
Expected: `sections OK`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): editorial lists, timeline and contact"
```

---

### Task 6: Vérification finale V2 (gate avant revue)

**Files:**
- Aucun (contrôles uniquement)

- [ ] **Step 1: Build frais**

Run: `npm run build 2>&1 | tail -n 8`
Expected: `16 page(s) built`, exit 0.

- [ ] **Step 2: Types**

Run: `npx tsc --noEmit 2>&1 | head -n 5`
Expected: vide, exit 0.

- [ ] **Step 3: Régressions automatisables**

Run: `python3 -c "
import pathlib,re,os
pages=list(pathlib.Path('dist').rglob('*.html'))
broken=[]
for f in pages:
    for u in re.findall(r'href=\"(/[^\"]+)\"',f.read_text()):
        if u.startswith('/_astro') or '.' in u.split('/')[-1]: continue
        t='dist'+u+('index.html' if u.endswith('/') else '')
        if not os.path.exists(t): broken.append((str(f),u))
assert not broken, broken
h=pathlib.Path('dist/index.html').read_text()
assert 'noindex' not in h
assert 'og:image' in h and 'noscript' in h
assert 'html.js' in open(__import__('glob').glob('dist/_astro/*.css')[0]).read()
print('regressions OK,', len(pages), 'pages')
"`
Expected: `regressions OK, 16 pages`.

- [ ] **Step 4: Check responsive/a11y manuel (checklist humaine, 10 min)**

Ouvrir `/` à 360px et 1280px (clair + sombre) et cocher : pas de scroll horizontal, hero 2→1 colonne, une + 2 secondaires empilées, `.pipeline` sans débordement, `ghost-num` ne masque aucun texte, focus visible sur tous les liens/CTA, `prefers-reduced-motion` désactive les transitions V2.

---

## Self-Review

**1. Spec coverage:** Hero 2 colonnes + carte statut + minibar (Task 4) ; une + secondaires + pipeline utile (Tasks 3–4) ; mono cantonnée aux métadonnées (Tasks 1–5) ; listes à filets + timeline (Task 5) ; sans screenshots/terminal/typing (contraintes globales + pipeline statique) ; dark/light et mobile traités dans chaque tâche.
**2. Placeholder scan:** Aucun TBD/TODO ; chaque étape contient le code exact, la commande exacte et le résultat attendu.
**3. Type consistency:** `Pipeline steps: string[]`, `ProjectSpotlight variant: 'feature'|'secondary'`, `pipelineBySlug` inline via `id.includes` (pas de type partagé à dériver) — cohérent entre Tasks 2–4.
