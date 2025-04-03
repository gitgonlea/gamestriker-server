import type { ServerDetail } from '@/types/server';
interface ServerDetailsProps {
    address: string;
    initialData?: ServerDetail;
}
export default function ServerDetails({ address, initialData }: ServerDetailsProps): import("react").JSX.Element;
export {};
