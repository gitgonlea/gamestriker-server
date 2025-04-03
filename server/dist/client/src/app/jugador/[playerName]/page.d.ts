interface PlayerPageProps {
    params: {
        playerName: string;
    };
}
export declare function generateMetadata({ params }: PlayerPageProps): Promise<{
    title: string;
    description: string;
}>;
export default function PlayerPage({ params }: PlayerPageProps): Promise<import("react").JSX.Element>;
export {};
