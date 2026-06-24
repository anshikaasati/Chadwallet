// components/trading/TradingLayout/TradingLayout.tsx
import React from "react";

export interface TradingLayoutProps {
  leftColumn: React.ReactNode;
  middleColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

export function TradingLayout({
  leftColumn,
  middleColumn,
  rightColumn,
}: TradingLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      <div className="hidden lg:block lg:col-span-1 border border-border rounded-lg p-4 bg-bg-surface">
        {leftColumn}
      </div>
      <div className="col-span-1 md:col-span-3 lg:col-span-3 flex flex-col gap-4">
        {middleColumn}
      </div>
      <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col gap-4">
        {rightColumn}
      </div>
    </div>
  );
}
export default TradingLayout;
