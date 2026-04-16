interface BillingPlan {
    tier: "free" | "lifetime";
    status: "active" | "inactive";
    activatedAt?: string;
    priceInr?: number;
}

interface BillingGateResult {
    allowed: boolean;
    reason?: string;
    remaining?: number;
}

const LIFETIME_PRICE_INR = 99;
const FREE_MONTHLY_ANALYSIS_LIMIT = 3;

// Keep this disabled while the app is being tested.
// Switch to `true` later when you want to enforce limits for free users.
export const ENABLE_USAGE_GATING = false;

const getMonthBucket = () => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};

const getPlanKey = (username: string) => `billing:plan:${username}`;
const getUsageKey = (username: string, month = getMonthBucket()) =>
    `billing:usage:${username}:${month}`;

export const getDefaultPlan = (): BillingPlan => ({
    tier: "free",
    status: "active",
});

export const getUserPlan = async (
    kv: {
        get: (key: string) => Promise<string | null | undefined>;
        set: (key: string, value: string) => Promise<boolean | undefined>;
    },
    username: string
): Promise<BillingPlan> => {
    const raw = await kv.get(getPlanKey(username));

    if (!raw) {
        const fallback = getDefaultPlan();
        await kv.set(getPlanKey(username), JSON.stringify(fallback));
        return fallback;
    }

    try {
        return JSON.parse(raw) as BillingPlan;
    } catch {
        return getDefaultPlan();
    }
};

export const getUsageCount = async (
    kv: {
        get: (key: string) => Promise<string | null | undefined>;
        set: (key: string, value: string) => Promise<boolean | undefined>;
    },
    username: string
): Promise<number> => {
    const raw = await kv.get(getUsageKey(username));
    if (!raw) {
        await kv.set(getUsageKey(username), "0");
        return 0;
    }

    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const canRunAnalysis = async (
    kv: {
        get: (key: string) => Promise<string | null | undefined>;
        set: (key: string, value: string) => Promise<boolean | undefined>;
    },
    username: string
): Promise<BillingGateResult> => {
    const plan = await getUserPlan(kv, username);

    if (!ENABLE_USAGE_GATING) {
        return {
            allowed: true,
            remaining: plan.tier === "lifetime" ? Infinity : FREE_MONTHLY_ANALYSIS_LIMIT,
        };
    }

    if (plan.tier === "lifetime" && plan.status === "active") {
        return { allowed: true, remaining: Infinity };
    }

    const used = await getUsageCount(kv, username);
    const remaining = Math.max(0, FREE_MONTHLY_ANALYSIS_LIMIT - used);

    if (remaining <= 0) {
        return {
            allowed: false,
            remaining: 0,
            reason: `You have used your ${FREE_MONTHLY_ANALYSIS_LIMIT} free analyses for this month. Upgrade to the ₹${LIFETIME_PRICE_INR} lifetime plan to continue.`,
        };
    }

    return { allowed: true, remaining };
};

export const recordAnalysisUsage = async (
    kv: {
        get: (key: string) => Promise<string | null | undefined>;
        set: (key: string, value: string) => Promise<boolean | undefined>;
    },
    username: string
): Promise<void> => {
    const plan = await getUserPlan(kv, username);

    if (plan.tier === "lifetime" && plan.status === "active") {
        return;
    }

    const used = await getUsageCount(kv, username);
    await kv.set(getUsageKey(username), String(used + 1));
};

// Future helper for when you add checkout / manual activation.
export const activateLifetimePlan = async (
    kv: {
        set: (key: string, value: string) => Promise<boolean | undefined>;
    },
    username: string
) => {
    const plan: BillingPlan = {
        tier: "lifetime",
        status: "active",
        activatedAt: new Date().toISOString(),
        priceInr: LIFETIME_PRICE_INR,
    };

    await kv.set(getPlanKey(username), JSON.stringify(plan));
};

