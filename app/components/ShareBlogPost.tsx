'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  title: string;
};

/**
 * Compartir enlace del post. Instagram no expone API para publicar Stories desde la web;
 * al pegar el enlace en el sticker «Enlace» de Historias, los metadatos OG ayudan al preview.
 */
export default function ShareBlogPost({ title }: Props) {
  const [url, setUrl] = useState('');
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const copyLink = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShareError(true);
      setTimeout(() => setShareError(false), 3000);
    }
  };

  const share = async () => {
    if (!url) return;
    setShareError(false);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setShareError(true);
      }
    } else {
      await copyLink();
    }
  };

  return (
    <section className="mt-10 border-t border-white/10 pt-8" aria-label="Compartir entrada">
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
        Compartir
      </h3>
      <p className="mb-4 max-w-xl text-sm leading-relaxed text-gray-500">
        Podés enviar este artículo por WhatsApp, Mail o la app que elijas. En{' '}
        <strong className="font-medium text-gray-400">Instagram</strong>, creá una historia,
        tocá el sticker <strong className="font-medium text-gray-400">«Enlace»</strong> y pegá la
        URL: se mostrará una vista previa con título e imagen (según la app).
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {canShare ? (
          <button
            type="button"
            onClick={share}
            disabled={!url}
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Compartir…
          </button>
        ) : null}
        <button
          type="button"
          onClick={copyLink}
          disabled={!url}
          className="rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm text-gray-300 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? 'Enlace copiado' : 'Copiar enlace'}
        </button>
      </div>
      {shareError && (
        <p className="mt-2 text-sm text-amber-400/90">No se pudo compartir. Probá copiar el enlace.</p>
      )}
      {url && (
        <p className="mt-4 break-all font-mono text-[11px] text-gray-600">{url}</p>
      )}
    </section>
  );
}
