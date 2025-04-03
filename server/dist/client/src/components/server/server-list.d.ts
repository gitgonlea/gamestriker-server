import type { Server } from '@/types/server';
interface ServerListProps {
    initialServers?: Server[];
    initialTotalPages?: number;
    queryId?: string;
    value?: string;
    varValue?: string;
}
export default function ServerList({ initialServers, initialTotalPages, queryId, value, varValue, }: ServerListProps): import("react").JSX.Element;
export {};
