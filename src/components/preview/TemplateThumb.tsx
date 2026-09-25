import { memo, useEffect, useRef } from 'react';
import { canvasSize, prepareScaledCanvas, renderPoster } from '../../engine';
import type { AspectRatio, Brand, Post, PosterAssets } from '../../engine';

interface Props {
  post: Post;
  templateId: string;
  brand: Brand;
  ratio: AspectRatio;
  assets: PosterAssets;
  fontsReady: boolean;
  width: number;
}

/** Small live render of the current post in a given template. */
export const TemplateThumb = memo(function TemplateThumb({ post, templateId, brand, ratio, assets, fontsReady, width }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = prepareScaledCanvas(canvas, ratio, width);
    if (!ctx) return;
    renderPoster(ctx, { post: { ...post, templateId }, brand, ratio, assets, mode: 'preview' });
  }, [post, templateId, brand, ratio, assets, fontsReady, width]);

  const { height } = canvasSize(ratio);
  return <canvas ref={ref} className="thumb-canvas" style={{ width, height: (width * height) / 1080 }} aria-hidden="true" />;
});
