export interface UserProfile {
    username: string;
    avatarPath?: string;
    updatedAt: string;
}

const getProfileKey = (username: string) => `profile:${username}`;

export const getUserProfile = async (
    kv: {
        get: (key: string) => Promise<string | null | undefined>;
        set: (key: string, value: string) => Promise<boolean | undefined>;
    },
    username: string
): Promise<UserProfile> => {
    const raw = await kv.get(getProfileKey(username));

    if (!raw) {
        const profile: UserProfile = {
            username,
            updatedAt: new Date().toISOString(),
        };
        await kv.set(getProfileKey(username), JSON.stringify(profile));
        return profile;
    }

    try {
        return JSON.parse(raw) as UserProfile;
    } catch {
        return {
            username,
            updatedAt: new Date().toISOString(),
        };
    }
};

export const saveUserProfile = async (
    kv: {
        set: (key: string, value: string) => Promise<boolean | undefined>;
    },
    profile: UserProfile
) => {
    const nextProfile = {
        ...profile,
        updatedAt: new Date().toISOString(),
    };

    await kv.set(getProfileKey(profile.username), JSON.stringify(nextProfile));
    return nextProfile;
};

