interface SearchPageProps {
    params: {
        queryId: string;
        value: string;
        varValue?: string;
    };
}
export declare function generateMetadata({ params }: SearchPageProps): Promise<{
    title: string;
    description: string;
}>;
export default function SearchPage({ params }: SearchPageProps): Promise<import("react").JSX.Element>;
export {};
