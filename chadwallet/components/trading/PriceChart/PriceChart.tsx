// components/trading/PriceChart/PriceChart.tsx
"use client";

import React, { useEffect, useId } from "react";
import { createDatafeed } from "@/lib/tradingview/datafeed";
import { SOL_MINT, USE_LOCAL_TRADINGVIEW } from "@/constants";

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
            interval: "15",
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
            height: isMobile ? 340 : 400,
            symbol: tokenAddress === SOL_MINT ? "BINANCE:SOLUSDT" : "BINANCE:SOLUSDT",
            interval: "15",
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
  }, [tokenAddress, containerId]);

  return (
    <div className="w-full h-[380px] sm:h-[450px] bg-bg-surface border border-border rounded-xl flex flex-col overflow-hidden relative shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-surface/50">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Live Price Chart</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
          <span className="text-[10px] font-bold text-buy uppercase">Live Feed</span>
        </div>
      </div>
      <div id={containerId} className="flex-1 w-full h-full min-h-[300px]" />
    </div>
  );
}

export default PriceChart;

