export const BRAND = {
  name: "VictorTools",
  company: "Victor Media",
  domain: "victormedia.net",
  canonicalUrl: "https://victormedia.net",
  accentColor: "#3B82F6", // Electric Blue
  contactEmail: "arasu9629hf@gmail.com",
  upiId: "arasu9629hf@okhdfcbank",
};

export const LIMITS = {
  free: {
    dailyLimit: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    watermark: true,
  },
  starter: {
    dailyLimit: 100,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    watermark: false,
  },
  pro: {
    dailyLimit: 999999, // Uncapped
    maxFileSize: 100 * 1024 * 1024, // 100MB
    watermark: false,
  },
  enterprise: {
    dailyLimit: 9999999, // Unlimited
    maxFileSize: 500 * 1024 * 1024, // 500MB
    watermark: false,
  },
};

export const PRICING = {
  monthly: {
    inr: 199,
    usd: 2.99,
  },
  starter: {
    inr: 49,
    usd: 0.99,
  },
  pro: {
    inr: 199,
    usd: 2.99,
  },
  enterprise: {
    inr: 499,
    usd: 5.99,
  },
};

export const FREE_DAILY_LIMIT = LIMITS.free.dailyLimit;
export const MAX_FILE_SIZE_FREE = LIMITS.free.maxFileSize;
export const MAX_FILE_SIZE_PRO = LIMITS.pro.maxFileSize;
