import dynamic from 'next/dynamic';

function FigureLoading() {
  return (
    <figure
      aria-hidden="true"
      className="border-line bg-surface my-6 h-48 animate-pulse rounded-lg border"
    />
  );
}

const LlmFigure = dynamic(() => import('./llm').then((module) => module.LlmFigure), {
  loading: FigureLoading,
});
const TokenizationFigure = dynamic(
  () => import('./tokenization').then((module) => module.TokenizationFigure),
  { loading: FigureLoading },
);
const TrainingLoopFigure = dynamic(
  () => import('./training-loop').then((module) => module.TrainingLoopFigure),
  { loading: FigureLoading },
);
const EmbeddingsFigure = dynamic(
  () => import('./embeddings').then((module) => module.EmbeddingsFigure),
  { loading: FigureLoading },
);
const SelfAttentionFigure = dynamic(
  () => import('./self-attention').then((module) => module.SelfAttentionFigure),
  { loading: FigureLoading },
);
const RlhfFigure = dynamic(() => import('./rlhf').then((module) => module.RlhfFigure), {
  loading: FigureLoading,
});
const TemperatureFigure = dynamic(
  () => import('./temperature').then((module) => module.TemperatureFigure),
  { loading: FigureLoading },
);

const FIGURES = {
  llm: LlmFigure,
  tokenization: TokenizationFigure,
  'training-loop': TrainingLoopFigure,
  embeddings: EmbeddingsFigure,
  'self-attention': SelfAttentionFigure,
  rlhf: RlhfFigure,
  temperature: TemperatureFigure,
} as const;

interface FigureProps {
  name: string;
}

export function Figure({ name }: FigureProps) {
  const Component = FIGURES[name as keyof typeof FIGURES];
  if (!Component) {
    return (
      <figure className="border-line bg-surface font-ui text-ink-soft my-6 rounded-lg border p-5 text-sm">
        Unknown figure: {name}
      </figure>
    );
  }
  return <Component />;
}
