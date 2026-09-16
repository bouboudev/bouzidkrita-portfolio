import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Parcours : un fichier = une expérience. `order` : 1 = plus récent.
const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    type: z.enum(['salarie', 'freelance', 'formation', 'associatif', 'support']).default('salarie'),
    summary: z.string(),
    highlights: z.array(z.string()),
    stack: z.array(z.string()),
    order: z.number(),
  }),
});

// Projets : le corps Markdown raconte contexte, besoin, solution, difficultés, apprentissages.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'developpement',
      'support',
      'integration',
      'infrastructure',
      'monitoring',
      'automatisation',
      'ia',
      'web',
      'personnel',
      'frontend',
      'backend',
      'fullstack',
    ]),
    status: z.string(),
    stack: z.array(z.string()),
    highlights: z.array(z.string()),
    github: z.string().url(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

// Blog : notes et retours d'expérience.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    readingTime: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { experience, projects, blog };
