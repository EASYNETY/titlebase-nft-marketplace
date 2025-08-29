export const SUPPORTED_TOKENS = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000", // Native ETH
    icon: "/crypto-icons/eth.svg",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
    icon: "/crypto-icons/usdc.svg",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", // Base USDT
    icon: "/crypto-icons/usdt.svg",
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", // Base DAI
    icon: "/crypto-icons/dai.svg",
  },
} as const

export const PAYMENT_METHODS = {
  CRYPTO: "crypto",
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
  PAYPAL: "paypal",
} as const

export const ESCROW_PERIODS = {
  STANDARD: 7 * 24 * 60 * 60, // 7 days in seconds
  EXPRESS: 3 * 24 * 60 * 60, // 3 days in seconds
  EXTENDED: 14 * 24 * 60 * 60, // 14 days in seconds
} as const
