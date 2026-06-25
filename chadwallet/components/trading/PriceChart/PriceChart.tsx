// components/trading/PriceChart/PriceChart.tsx
"use client";

import React, { useEffect, useId } from "react";
import { createDatafeed } from "@/lib/tradingview/datafeed";
import { SOL_MINT, USE_LOCAL_TRADINGVIEW } from "@/constants";
import { Star, Share2, Maximize2 } from "lucide-react";

export interface PriceChartProps {
  tokenAddress: string;
}

interface TradingViewWidget {
  new (options: Record<string, unknown>): {
    remove: () => void;
  };
}

interface TradingViewWindow extends Window {
  TradingView?: {
    widget: TradingViewWidget;
  };
}

export function PriceChart({ tokenAddress }: PriceChartProps): React.JSX.Element {
  const containerId = useId().replace(/:/g, "_");
  const [timeframe, setTimeframe] = React.useState<"15" | "60" | "240" | "D">("15");
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [copiedShare, setCopiedShare] = React.useState(false);

  useEffect(() => {
    let isMounted = true;
    let activeWidget: { remove: () => void } | null = null;
    let scriptsLoaded = new Set<string>();

    const getCssVar = (name: string, fallback: string): string => {
      if (typeof window === "undefined") return fallback;
      const val = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return val || fallback;
    };

    const loadScript = (src: string, callback: () => void, onError: () => void): void => {
      if (scriptsLoaded.has(src)) {
        callback();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => {
        scriptsLoaded.add(src);
        if (isMounted) callback();
      };
      script.onerror = () => {
        if (isMounted) onError();
      };
      document.head.appendChild(script);
    };

    const initChart = (srcUrl: string): void => {
      const wWindow = window as unknown as TradingViewWindow;
      if (!wWindow.TradingView) return;

      try {
        const isAdvanced = srcUrl.includes("charting_library");

        const bgPrimary = getCssVar("--color-bg-primary", "#0a0a0f");
        const border = getCssVar("--color-border", "#1e1e2f");
        const textMuted = getCssVar("--color-text-muted", "#94a3b8");
        const buy = getCssVar("--color-buy", "#22c55e");
        const sell = getCssVar("--color-sell", "#ef4444");
        
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

        if (isAdvanced) {
          activeWidget = new wWindow.TradingView.widget({
            symbol: tokenAddress === SOL_MINT ? "SOL" : "TOKEN",
            interval: timeframe,
            container: containerId,
            datafeed: createDatafeed(tokenAddress),
            library_path: "/tradingview/charting_library/",
            locale: "en",
            theme: "Dark",
            autosize: true,
            disabled_features: ["use_localstorage_for_settings", ...(isMobile ? ["left_toolbar"] : [])],
            enabled_features: [],
            overrides: {
              "paneProperties.background": bgPrimary,
              "paneProperties.vertGridProperties.color": border,
              "paneProperties.horzGridProperties.color": border,
              "scalesProperties.textColor": textMuted,
              "mainSeriesProperties.candleStyle.upColor": buy,
              "mainSeriesProperties.candleStyle.downColor": sell,
              "mainSeriesProperties.candleStyle.borderUpColor": buy,
              "mainSeriesProperties.candleStyle.borderDownColor": sell,
              "mainSeriesProperties.candleStyle.wickUpColor": buy,
              "mainSeriesProperties.candleStyle.wickDownColor": sell,
            },
          });
        } else {
          // CDN Fallback widget
          activeWidget = new wWindow.TradingView.widget({
            width: "100%",
            height: "100%",
            symbol: tokenAddress === SOL_MINT ? "BINANCE:SOLUSDT" : "BINANCE:SOLUSDT",
            interval: timeframe,
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: bgPrimary,
            enable_publishing: false,
            hide_side_toolbar: isMobile,
            allow_symbol_change: true,
            container_id: containerId,
          });
        }
      } catch (err) {
        console.error("TradingView widget initialization failed:", err);
      }
    };

    const tryLocalThenCDN = (): void => {
      const useLocal = USE_LOCAL_TRADINGVIEW;
      const localSrc = "/tradingview/charting_library/charting_library.js";
      const cdnSrc = "https://s3.tradingview.com/tv.js";

      if (useLocal) {
        loadScript(
          localSrc,
          () => {
            initChart(localSrc);
          },
          () => {
            console.warn("Advanced Charting Library script not found, falling back to tv.js CDN");
            loadScript(
              cdnSrc,
              () => {
                initChart(cdnSrc);
              },
              () => {
                console.error("Failed to load both TradingView charting libraries");
              }
            );
          }
        );
      } else {
        loadScript(
          cdnSrc,
          () => {
            initChart(cdnSrc);
          },
          () => {
            console.error("Failed to load TradingView charting library from CDN");
          }
        );
      }
    };

    tryLocalThenCDN();

    return () => {
      isMounted = false;
      if (activeWidget && typeof activeWidget.remove === "function") {
        try {
          activeWidget.remove();
        } catch (err) {
          console.warn("Failed to remove TradingView widget safely:", err);
        }
      }
    };
  }, [tokenAddress, containerId, timeframe]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleFullscreen = () => {
    const el = document.getElementById(containerId);
    if (el) {
      if (!document.fullscreenElement) {
        el.requestFullscreen().catch((err) => {
          console.warn("Error attempting to enable fullscreen:", err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="w-full lg:h-[700px] h-[450px] bg-[#0b1120]/45 border border-white/10 rounded-3xl flex flex-col overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      {/* Chart Control Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-black/10 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Timeframes</span>
          <div className="flex bg-black/45 border border-white/5 p-0.5 rounded-lg">
            {[
              { label: "15m", value: "15" },
              { label: "1h", value: "60" },
              { label: "4h", value: "240" },
              { label: "1D", value: "D" },
            ].map((tf) => (
              <button
                key={tf.value}
                type="button"
                onClick={() => setTimeframe(tf.value as any)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  timeframe === tf.value
                    ? "bg-accent text-white shadow-sm"
                    : "text-text-dim hover:text-white"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Favorite */}
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              isFavorite
                ? "bg-amber-500/10 border-amber-500/35 text-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                : "bg-white/5 border-white/10 text-text-dim hover:text-white hover:border-white/20"
            }`}
            title="Add to Favorites"
          >
            <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-500" : ""}`} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className={`h-8 px-3 rounded-lg border flex items-center gap-1.5 transition-all text-[10px] font-bold cursor-pointer ${
              copiedShare
                ? "bg-buy/10 border-buy/30 text-buy"
                : "bg-white/5 border-white/10 text-text-dim hover:text-white hover:border-white/20"
            }`}
            title="Copy Page Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedShare ? "Copied" : "Share"}
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={handleFullscreen}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-text-dim hover:text-white hover:border-white/20 flex items-center justify-center transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div id={containerId} className="flex-1 w-full h-full min-h-[300px]" />
    </div>
  );
}

export default PriceChart;

