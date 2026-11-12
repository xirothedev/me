export interface WorkEntry {
  name: string;
  kind: string;
  summary: string;
  meta: string;
  href?: string;
  external?: boolean;
}

export const work: WorkEntry[] = [
  {
    name: 'TaxEasy',
    kind: 'Tax management SaaS',
    summary:
      'Receipt and invoice ingestion, OCR extraction, anomaly detection, and observability for tax agents.',
    meta: 'Private · 400+ PRs',
  },
  {
    name: 'Ecopick',
    kind: 'Marketplace and tournaments',
    summary:
      'A support assistant, product matcher, and refund gate on a state-machine marketplace engine.',
    meta: 'Private · 300+ PRs',
  },
  {
    name: 'XaDaoXa',
    kind: 'Government e-services',
    summary: 'A Zalo MiniApp for citizens and a staff CMS for commune officials.',
    meta: 'Live for citizens',
  },
  {
    name: 'Hospital AI Assistant',
    kind: 'Clinical document retrieval',
    summary: 'Local models and self-hosted RAGFlow inside a provincial hospital network.',
    meta: 'In pilot · Case study',
    href: '/hospital',
  },
  {
    name: 'Agent Skills',
    kind: 'Open source',
    summary: 'NestJS rules for security, validation, architecture, and testing.',
    meta: 'Open source',
    href: 'https://github.com/xirothedev/agent-skills',
    external: true,
  },
];
