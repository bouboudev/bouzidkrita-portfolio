// Slug d'une entrée de collection (Astro Content Layer : `id` = "dossier/fichier.md").
export function slugOf(entry: { id: string }): string {
  return entry.id.replace(/\.md$/, '').split('/').pop() ?? entry.id;
}
