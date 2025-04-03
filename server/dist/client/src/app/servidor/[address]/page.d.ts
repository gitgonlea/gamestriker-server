interface ServerPageProps {
    params: {
        address: string;
    };
}
export declare function generateMetadata({ params }: ServerPageProps): Promise<{
    title: string;
    description: string;
    openGraph?: undefined;
} | {
    title: any;
    description: string;
    openGraph: {
        title: any;
        description: string;
        images: string[];
    };
}>;
export default function ServerPage({ params }: ServerPageProps): Promise<import("react").JSX.Element>;
export {};
