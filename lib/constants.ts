export const BRAND = {
  name: "VictorTools",
  company: "Victor Media",
  domain: "victormedia.net",
  canonicalUrl: "https://victormedia.net",
  accentColor: "#3B82F6", // Electric Blue
};

export const LIMITS = {
  free: {
    dailyLimit: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    watermark: true,
  },
  pro: {
    dailyLimit: 999999, // Uncapped
    maxFileSize: 100 * 1024 * 1024, // 100MB
    watermark: false,
  },
};

export const PRICING = {
  monthly: {
    inr: 299,
    usd: 4.99,
  },
};
