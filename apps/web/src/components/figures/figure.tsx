import { EmbeddingsFigure } from './embeddings';
import { LlmFigure } from './llm';
import { RlhfFigure } from './rlhf';
import { SelfAttentionFigure } from './self-attention';
import { TemperatureFigure } from './temperature';
import { TokenizationFigure } from './tokenization';
import { TrainingLoopFigure } from './training-loop';

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
