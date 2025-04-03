declare const _default: () => {
    environment: string;
    PORT: number;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    timezone: string;
    server: {
        updateInterval: number;
        queryTimeout: number;
    };
    bannerSettings: {
        outputPath: string;
    };
};
export default _default;
