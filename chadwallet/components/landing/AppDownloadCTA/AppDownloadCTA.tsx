// components/landing/AppDownloadCTA/AppDownloadCTA.tsx
import React from "react";
import { APP_STORE_ANDROID, APP_STORE_IOS } from "@/constants";

export function AppDownloadCTA(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-bg-surface rounded-lg border border-border">
      <h3 className="text-xl font-bold mb-4">Take ChadWallet on the go</h3>
      <div className="flex gap-4">
        <a
          href={APP_STORE_IOS}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-accent text-white font-semibold rounded-md hover:bg-opacity-95"
        >
          App Store
        </a>
        <a
          href={APP_STORE_ANDROID}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-bg-primary border border-border font-semibold rounded-md hover:bg-bg-surface"
        >
          Google Play
        </a>
      </div>
    </div>
  );
}
export default AppDownloadCTA;
