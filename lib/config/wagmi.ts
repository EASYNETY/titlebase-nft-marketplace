import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { base, baseSepolia } from "wagmi/chains"

export const config = getDefaultConfig({
  appName: "Title NFT Marketplace",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "2f05a7cdc1588bc900adc5b17a2b8e32",
  chains: [base, baseSepolia],
  ssr: true,
})
