// components/landing/AppDownloadCTA/AppDownloadCTA.tsx
import React from "react";
import { APP_STORE_ANDROID, APP_STORE_IOS } from "@/constants";

export function AppDownloadCTA(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4 mt-2">
      <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">
        Available on Mobile
      </span>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        {/* Apple App Store Badge */}
        <a
          href={APP_STORE_IOS}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 bg-black border border-border hover:border-text-muted rounded-lg transition-colors w-48 select-none cursor-pointer"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.74 19.67 18.11 18.71 19.5M15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C15.85 1.04 14.51 1.73 13.73 2.64C13.07 3.41 12.49 4.52 12.64 5.78C13.87 5.87 15.12 5.17 15.97 4.17Z" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-text-muted leading-tight uppercase font-medium">
              Download on the
            </span>
            <span className="text-sm font-bold text-white leading-tight -mt-0.5">
              App Store
            </span>
          </div>
        </a>

        {/* Google Play Store Badge */}
        <a
          href={APP_STORE_ANDROID}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 bg-black border border-border hover:border-text-muted rounded-lg transition-colors w-48 select-none cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M3 5.27793C3 4.25895 4.1165 3.63004 4.99187 4.15286L20.2525 13.2676C21.1092 13.7792 21.1092 15.0131 20.2525 15.5247L4.99187 24.6394C4.1165 25.1623 3 24.5333 3 23.5144V5.27793Z" fill="url(#play-grad)" />
            <defs>
              <linearGradient id="play-grad" x1="3" y1="14.3962" x2="20.67" y2="14.3962" gradientUnits="userSpaceOnUse">
                <stop stop-color="#00C0FF" />
                <stop offset="0.3" stop-color="#00E7A6" />
                <stop offset="0.7" stop-color="#FFC500" />
                <stop offset="1" stop-color="#FF3A44" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-text-muted leading-tight uppercase font-medium">
              GET IT ON
            </span>
            <span className="text-sm font-bold text-white leading-tight -mt-0.5">
              Google Play
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
export default AppDownloadCTA;
