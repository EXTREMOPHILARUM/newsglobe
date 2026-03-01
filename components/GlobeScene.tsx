"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Map, {
  Marker,
  Popup,
  MapRef,
  MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNewsStore } from "@/lib/newsStore";
import { CATEGORY_COLORS, NewsArticle } from "@/lib/types";
import { COUNTRIES } from "@/lib/countryFeeds";
import DayNightOverlay from "./DayNightOverlay";

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLng = (lng2 - lng1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371;
}

const DARK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

// Check if a point is on the visible hemisphere
function isOnVisibleSide(
  dotLat: number,
  dotLng: number,
  centerLat: number,
  centerLng: number
): boolean {
  const toRad = Math.PI / 180;
  const dLng = (dotLng - centerLng) * toRad;
  const lat1 = centerLat * toRad;
  const lat2 = dotLat * toRad;
  // Cosine of angular distance on the sphere
  const cosAngle =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLng);
  // visible if angle < 90° (cosAngle > 0), with small margin for edge dots
  return cosAngle > -0.1;
}

function NewsDot({
  article,
  onClick,
  visible,
}: {
  article: NewsArticle;
  onClick: (a: NewsArticle) => void;
  visible: boolean;
}) {
  const color = CATEGORY_COLORS[article.category] || "#ffffff";
  const { setHoveredArticle } = useNewsStore();

  if (!visible) return null;

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
  const { filteredArticles, selectCountry, selectedCountry, countryArticles, pendingFlyTo, flyToVersion } = useNewsStore();
  const [popupArticle, setPopupArticle] = useState<NewsArticle | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 30, lng: 20 });
  const [mapZoom, setMapZoom] = useState(1.8);
  const dotClickedRef = useRef(false);

  const dots = (selectedCountry ? countryArticles : filteredArticles).slice(0, 100);

  const handleDotClick = useCallback((article: NewsArticle) => {
    dotClickedRef.current = true;
    setPopupArticle(article);
  }, []);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      // Skip if a news dot was just clicked
      if (dotClickedRef.current) {
        dotClickedRef.current = false;
        return;
      }

      const { lat, lng } = e.lngLat;
      const MAX_DISTANCE_KM = 2000;

      let nearest: (typeof COUNTRIES)[0] | null = null;
      let nearestDist = Infinity;
      for (const c of COUNTRIES) {
        const d = haversineDistance(lat, lng, c.lat, c.lng);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = c;
        }
      }

      if (!nearest || nearestDist > MAX_DISTANCE_KM) return;

      selectCountry(nearest.code, nearest.name);
      setPopupArticle(null);
    },
    [selectCountry]
  );

  const isUserInteracting = useRef(false);
  const isFlyingTo = useRef(false);

  // React to pendingFlyTo from store (country selection, search, back)
  useEffect(() => {
    if (!pendingFlyTo || !mapRef.current) return;
    const map = mapRef.current.getMap();

    isFlyingTo.current = true;
    map.once("moveend", () => {
      isFlyingTo.current = false;
    });

    mapRef.current.flyTo({
      center: [pendingFlyTo.lng, pendingFlyTo.lat],
      zoom: pendingFlyTo.zoom,
      duration: 1500,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyToVersion]);
  const rotationSpeed = 0.03; // degrees per frame

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current.getMap();
    try {
      map.setProjection({ type: "globe" });
    } catch {
      // globe projection not supported in this version
    }

    // Track center for visibility culling
    const updateCenter = () => {
      const c = map.getCenter();
      setMapCenter({ lat: c.lat, lng: c.lng });
      setMapZoom(map.getZoom());
    };
    map.on("move", updateCenter);

    // Auto-rotate the globe
    let animationId: number;

    const ROTATION_MAX_ZOOM = 3.5; // stop rotating when zoomed in past this

    const rotate = () => {
      if (!isUserInteracting.current && !isFlyingTo.current && mapRef.current) {
        const map = mapRef.current.getMap();
        if (map.getZoom() < ROTATION_MAX_ZOOM) {
          const center = map.getCenter();
          center.lng += rotationSpeed;
          map.setCenter(center);
        }
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

    return () => {
      cancelAnimationFrame(animationId);
      map.off("move", updateCenter);
    };
  }, [mapLoaded]);

  // When zoomed in enough, all dots are visible (flat map mode)
  const useGlobeCulling = mapZoom < 5;

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
        onClick={handleMapClick}
        maxZoom={18}
        minZoom={1}
      >

        <DayNightOverlay />

        {dots.map((article) => (
          <NewsDot
            key={article.id}
            article={article}
            onClick={handleDotClick}
            visible={
              !useGlobeCulling ||
              isOnVisibleSide(article.lat, article.lng, mapCenter.lat, mapCenter.lng)
            }
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
