import dynamic from 'next/dynamic';
import { createElement, type ComponentType } from 'react';

interface FigureEntry {
  name: string;
  Component: ComponentType;
}

function FigureLoading() {
  return (
    <figure
      aria-hidden="true"
      className="border-line bg-surface my-6 h-48 animate-pulse rounded-lg border"
    />
  );
}

const FIGURES: FigureEntry[] = [
  {
    name: 'llm',
    Component: dynamic(() => import('./llm').then((module) => module.LlmFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: 'tokenization',
    Component: dynamic(() => import('./tokenization').then((module) => module.TokenizationFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: 'training-loop',
    Component: dynamic(
      () => import('./training-loop').then((module) => module.TrainingLoopFigure),
      { loading: FigureLoading },
    ),
  },
  {
    name: 'embeddings',
    Component: dynamic(() => import('./embeddings').then((module) => module.EmbeddingsFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: 'self-attention',
    Component: dynamic(
      () => import('./self-attention').then((module) => module.SelfAttentionFigure),
      { loading: FigureLoading },
    ),
  },
  {
    name: 'rlhf',
    Component: dynamic(() => import('./rlhf').then((module) => module.RlhfFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: 'temperature',
    Component: dynamic(() => import('./temperature').then((module) => module.TemperatureFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: 'taxeasy-ingest',
    Component: dynamic(
      () => import('./taxeasy-ingest').then((module) => module.TaxEasyIngestFigure),
      { loading: FigureLoading },
    ),
  },
  {
    name: 'ecopick-refund-gate',
    Component: dynamic(
      () => import('./ecopick-refund-gate').then((module) => module.EcopickRefundGateFigure),
      { loading: FigureLoading },
    ),
  },
  {
    name: 'xadaoxa-submission-flow',
    Component: dynamic(
      () =>
        import('./xadaoxa-submission-flow').then((module) => module.XaDaoXaSubmissionFlowFigure),
      { loading: FigureLoading },
    ),
  },
];

const FIGURES_BY_NAME = new Map(FIGURES.map((figure) => [figure.name, figure.Component]));

interface FigureProps {
  name: string;
}

export function Figure({ name }: FigureProps) {
  const ResolvedFigure = FIGURES_BY_NAME.get(name);
  if (!ResolvedFigure) {
    return (
      <figure className="border-line bg-surface font-ui text-ink-soft my-6 rounded-lg border p-5 text-sm">
        Unknown figure: {name}
      </figure>
    );
  }
  return createElement(ResolvedFigure);
}
