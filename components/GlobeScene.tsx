"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNewsStore } from "@/lib/newsStore";
import { CATEGORY_COLORS, NewsArticle } from "@/lib/types";
import DayNightOverlay from "./DayNightOverlay";

const DARK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

function NewsDot({
  article,
  onClick,
}: {
  article: NewsArticle;
  onClick: (a: NewsArticle) => void;
}) {
  const color = CATEGORY_COLORS[article.category] || "#ffffff";
  const { setHoveredArticle } = useNewsStore();

  return (
    <Marker
      latitude={article.lat}
      longitude={article.lng}
      anchor="center"
    >
      <div
        className="relative cursor-pointer group"
        onClick={() => onClick(article)}
        onMouseEnter={() => setHoveredArticle(article)}
        onMouseLeave={() => setHoveredArticle(null)}
      >
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{
            backgroundColor: color,
            width: 20,
            height: 20,
            top: -4,
            left: -4,
          }}
        />
        {/* Glow */}
        <div
          className="absolute rounded-full blur-sm"
          style={{
            backgroundColor: color,
            opacity: 0.4,
            width: 18,
            height: 18,
            top: -3,
            left: -3,
          }}
        />
        {/* Dot */}
        <div
          className="rounded-full border border-white/30 relative z-10"
          style={{
            backgroundColor: color,
            width: 12,
            height: 12,
            boxShadow: `0 0 8px ${color}, 0 0 20px ${color}40`,
          }}
        />
      </div>
    </Marker>
  );
}

export default function GlobeScene() {
  const mapRef = useRef<MapRef>(null);
  const { filteredArticles } = useNewsStore();
  const [popupArticle, setPopupArticle] = useState<NewsArticle | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const dots = filteredArticles.slice(0, 100);

  const handleDotClick = useCallback((article: NewsArticle) => {
    setPopupArticle(article);
  }, []);

  const isUserInteracting = useRef(false);
  const rotationSpeed = 0.03; // degrees per frame

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current.getMap();
    try {
      map.setProjection({ type: "globe" });
    } catch {
      // globe projection not supported in this version
    }

    // Auto-rotate the globe
    let animationId: number;

    const rotate = () => {
      if (!isUserInteracting.current && mapRef.current) {
        const map = mapRef.current.getMap();
        const center = map.getCenter();
        center.lng += rotationSpeed;
        map.setCenter(center);
      }
      animationId = requestAnimationFrame(rotate);
    };

    // Pause rotation on user interaction
    map.on("mousedown", () => { isUserInteracting.current = true; });
    map.on("touchstart", () => { isUserInteracting.current = true; });
    map.on("mouseup", () => { isUserInteracting.current = false; });
    map.on("touchend", () => { isUserInteracting.current = false; });
    map.on("wheel", () => {
      isUserInteracting.current = true;
      // Resume after a short delay
      setTimeout(() => { isUserInteracting.current = false; }, 2000);
    });

    animationId = requestAnimationFrame(rotate);

    return () => cancelAnimationFrame(animationId);
  }, [mapLoaded]);

  return (
    <div className="absolute inset-0">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 20,
          latitude: 30,
          zoom: 1.8,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={DARK_STYLE}
        attributionControl={false}
        onLoad={() => setMapLoaded(true)}
        maxZoom={18}
        minZoom={1}
      >
        <NavigationControl position="bottom-left" showCompass={false} />
        <DayNightOverlay />

        {dots.map((article) => (
          <NewsDot
            key={article.id}
            article={article}
            onClick={handleDotClick}
          />
        ))}

        {popupArticle && (
          <Popup
            latitude={popupArticle.lat}
            longitude={popupArticle.lng}
            anchor="bottom"
            onClose={() => setPopupArticle(null)}
            closeButton={true}
            closeOnClick={false}
            className="news-popup"
          >
            <div className="bg-black/95 p-3 rounded-lg max-w-[280px] -m-[10px]">
              <p className="text-white text-xs font-semibold leading-tight">
                {popupArticle.title}
              </p>
              {popupArticle.snippet && (
                <p className="text-gray-400 text-[10px] mt-1.5 leading-relaxed line-clamp-2">
                  {popupArticle.snippet}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-500 text-[10px]">
                  {popupArticle.source}
                </span>
                <a
                  href={popupArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-[10px] hover:text-blue-300"
                >
                  Read more →
                </a>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
