interface globalConfig {
    siteName: string;
    apiBaseUrl: string | undefined;
}

export const globalConfig: globalConfig = {
    siteName: "Dinner at 8",
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
}