import dynamic from 'next/dynamic';
import { createElement, type ComponentType } from 'react';
import { figureRegistration as ecopickRefundGateRegistration } from './ecopick-refund-gate';
import { figureRegistration as embeddingsRegistration } from './embeddings';
import { figureRegistration as llmRegistration } from './llm';
import { figureRegistration as rlhfRegistration } from './rlhf';
import { figureRegistration as selfAttentionRegistration } from './self-attention';
import { figureRegistration as taxEasyIngestRegistration } from './taxeasy-ingest';
import { figureRegistration as temperatureRegistration } from './temperature';
import { figureRegistration as tokenizationRegistration } from './tokenization';
import { figureRegistration as trainingLoopRegistration } from './training-loop';
import { figureRegistration as xaDaoXaSubmissionFlowRegistration } from './xadaoxa-submission-flow';

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
    name: llmRegistration.name,
    Component: dynamic(() => import('./llm').then((module) => module.LlmFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: tokenizationRegistration.name,
    Component: dynamic(() => import('./tokenization').then((module) => module.TokenizationFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: trainingLoopRegistration.name,
    Component: dynamic(
      () => import('./training-loop').then((module) => module.TrainingLoopFigure),
      { loading: FigureLoading },
    ),
  },
  {
    name: embeddingsRegistration.name,
    Component: dynamic(() => import('./embeddings').then((module) => module.EmbeddingsFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: selfAttentionRegistration.name,
    Component: dynamic(
      () => import('./self-attention').then((module) => module.SelfAttentionFigure),
      { loading: FigureLoading },
    ),
  },
  {
    name: rlhfRegistration.name,
    Component: dynamic(() => import('./rlhf').then((module) => module.RlhfFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: temperatureRegistration.name,
    Component: dynamic(() => import('./temperature').then((module) => module.TemperatureFigure), {
      loading: FigureLoading,
    }),
  },
  {
    name: taxEasyIngestRegistration.name,
    Component: dynamic(
      () => import('./taxeasy-ingest').then((module) => module.TaxEasyIngestFigure),
      { loading: FigureLoading },
    ),
  },
  {
    name: ecopickRefundGateRegistration.name,
    Component: dynamic(
      () => import('./ecopick-refund-gate').then((module) => module.EcopickRefundGateFigure),
      { loading: FigureLoading },
    ),
  },
  {
    name: xaDaoXaSubmissionFlowRegistration.name,
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
