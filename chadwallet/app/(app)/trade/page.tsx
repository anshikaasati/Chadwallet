// app/(app)/trade/page.tsx
import { redirect } from "next/navigation";
import { SOL_MINT } from "@/constants";

export default function TradeIndexPage(): never {
  redirect(`/trade/${SOL_MINT}`);
}
