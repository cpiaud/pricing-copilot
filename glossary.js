// Inline glossary shared by all pages.
// Markup: <button type="button" class="gl" data-gl="input"></button> next to a term.
// The button gets a "?" and an aria-label; clicking, focusing with Enter, or hovering opens a
// short definition. Esc, a click outside, or leaving the button closes it.
(() => {
  const GLOSSARY = {
    token: ['Token', 'Un fragment de texte lu ou produit par un modèle. Les prix sont indiqués en crédits IA par million de tokens.'],
    input: ['Tokens en entrée', 'Tout ce qui est envoyé au modèle : consigne, fichiers ouverts et historique de conversation.'],
    output: ['Tokens en sortie', 'Ce que le modèle produit : code, réponses et raisonnement.'],
    credit: ['Crédit IA', 'GitHub Copilot facture les modèles en crédits IA. Un crédit vaut 0,01 dollar.'],
    mix: ['Répartition entrée / sortie', 'La proportion de tokens envoyés et produits. Les agents de développement relisent souvent les fichiers et l’historique.'],
    blended: ['Prix moyen', 'Prix par million de tokens, pondéré selon la répartition entre entrée et sortie.'],
    long: ['Contexte long', 'Certains modèles coûtent plus cher lorsque la taille de la requête dépasse un seuil.'],
    class: ['Catégorie', 'Catégories de GitHub selon les capacités : léger, polyvalent et puissant.'],
    multCheap: ['×N', 'Rapport au modèle le moins cher affiché : ×10 signifie un prix dix fois plus élevé.'],
    moreTokens: ['N fois plus', 'Nombre de tokens comparé au modèle le plus cher pour un même budget.'],
    workday: ['Jour ouvré', 'Le budget mensuel est réparti sur 22 jours ouvrés.'],
    maxDay: ['Maximum de requêtes par jour', 'Nombre maximal de requêtes par jour ouvré permettant de tenir tout le mois.'],
    runwayUse: ['Crédits à ce rythme', 'Coût par requête multiplié par le nombre de requêtes quotidiennes et 22 jours ouvrés.'],
    request: ['Requête agent', 'Une étape d’agent estimée à 50 000 tokens, comprenant les fichiers, l’historique et la réponse.'],
    index: ['Indice Artificial Analysis', 'Score composite : plus il est élevé, mieux c’est. Coding mesure le code ; Intelligence couvre aussi le raisonnement et les connaissances.'],
    frontier: ['Frontière de Pareto', 'Modèles qu’aucun modèle moins cher ne surpasse en matière de score.'],
    cached: ['Entrée en cache', 'Données d’entrée réutilisées par le fournisseur et facturées à un tarif réduit.'],
    cachewrite: ['Écriture en cache', 'Prix éventuellement facturé pour stocker une première fois le début d’une requête.'],
    perdollar: ['Points de code pour 100 crédits', 'Score Coding rapporté au prix moyen : plus il est élevé, meilleur est le rapport qualité-prix.'],
    log: ['Échelle logarithmique', 'Chaque graduation multiplie le prix au lieu de lui ajouter une valeur fixe.'],
    quality: ['Qualité', 'Score du modèle comparé au meilleur modèle Copilot sur la même évaluation.'],
  };

  const css = `
.gl {
  appearance: none; display: inline-grid; place-items: center; vertical-align: 1px;
  width: 15px; height: 15px; padding: 0; margin-left: 5px;
  border: 1px solid var(--rule-strong); border-radius: 50%; background: transparent;
  font: 500 10px/1 var(--font-sans); letter-spacing: 0; text-transform: none; color: var(--ink-3);
  cursor: help; transition: color .15s, border-color .15s;
}
.gl-t { white-space: nowrap; }
.gl:hover, .gl[aria-expanded="true"] { color: var(--ink); border-color: var(--ink-2); }
.gl:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.gl-pop {
  position: absolute; z-index: 20; max-width: 280px;
  background: var(--surface); border: 1px solid var(--rule-strong); border-radius: 10px;
  padding: 12px 14px; box-shadow: 0 8px 24px rgb(0 0 0 / .1);
  font: 400 13px/1.45 var(--font-sans); color: var(--ink-2); text-transform: none; letter-spacing: 0;
}
.gl-pop b { display: block; color: var(--ink); font-weight: 500; margin-bottom: 4px; }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  const pop = document.createElement('div');
  pop.className = 'gl-pop';
  pop.id = 'gl-pop';
  pop.setAttribute('role', 'tooltip');
  pop.hidden = true;
  document.body.append(pop);

  let open = null, pinned = false;
  function show(btn, pin) {
    const entry = GLOSSARY[btn.dataset.gl];
    if (!entry) return;
    if (open && open !== btn) open.setAttribute('aria-expanded', 'false');
    open = btn; pinned = pin;
    const b = document.createElement('b');
    b.textContent = entry[0];
    pop.replaceChildren(b, entry[1]);
    pop.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    const r = btn.getBoundingClientRect();
    const w = pop.offsetWidth;
    const left = Math.max(8, Math.min(r.left + scrollX - 12, scrollX + document.documentElement.clientWidth - w - 8));
    pop.style.left = left + 'px';
    pop.style.top = (r.bottom + scrollY + 8) + 'px';
  }
  function hide() {
    if (open) open.setAttribute('aria-expanded', 'false');
    open = null; pinned = false;
    pop.hidden = true;
  }

  // Buttons can be created later (re-rendered sentences): bind() labels them, events are delegated.
  function bind(btn) {
    const entry = GLOSSARY[btn.dataset.gl];
    if (!entry) return;
    btn.type = 'button';
    btn.textContent = '?';
    btn.setAttribute('aria-label', 'Définition : ' + entry[0]);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-describedby', 'gl-pop');
  }
  window.glossaryBind = bind;
  document.querySelectorAll('.gl[data-gl]').forEach(bind);
  const glOf = t => (t instanceof Element ? t.closest('.gl[data-gl]') : null);
  document.addEventListener('click', e => {
    const btn = glOf(e.target);
    if (!btn) return;
    e.preventDefault(); e.stopPropagation();
    open === btn && pinned ? hide() : show(btn, true);
  }, true);
  document.addEventListener('mouseover', e => { const btn = glOf(e.target); if (btn && !pinned) show(btn, false); });
  document.addEventListener('mouseout', e => { const btn = glOf(e.target); if (btn && !pinned && open === btn) hide(); });
  document.addEventListener('click', e => { if (open && !pop.contains(e.target)) hide(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) { const b = open; hide(); b.focus(); } });
  addEventListener('resize', hide);
})();
