"use client";

import { useState } from "react";

export default function InfoButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center text-sm font-serif italic"
      >
        i
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-zinc-950/95 border border-white/10 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-lg"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-1">NewsGlobe</h2>
            <p className="text-white/40 text-xs mb-4">Real-time news on a 3D globe</p>

            <div className="space-y-3 text-sm text-white/70 leading-relaxed">
              <p>
                I saw{" "}
                <a
                  href="https://pizz.watch/polyglobe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 underline underline-offset-2 decoration-white/30 hover:decoration-white/60 transition-colors"
                >
                  Polyglobe
                </a>
                {" "}doing this for Polymarket bets and thought — why not news?
                The spinning globe looked cool so I just went ahead and built it.
              </p>

              <p>
                It grabs headlines from ~150 countries, throws them on a globe,
                and you can click around to see what&apos;s going on anywhere.
                That&apos;s pretty much it.
              </p>

              <div className="pt-2 border-t border-white/5">
                <p className="text-white/40 text-xs">
                  Next.js &middot; MapLibre GL &middot; Three.js &middot; Cloudflare Workers
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
