"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = generateMetadata;
exports.default = ServerPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const server_details_1 = require("@/components/server/server-details");
const servers_1 = require("@/lib/api/servers");
async function generateMetadata({ params }) {
    const { address } = params;
    try {
        const [host, port] = address.split(':');
        const serverData = await (0, servers_1.getServerDetails)(host, port);
        if (!serverData || serverData.length === 0) {
            return {
                title: 'Server Not Found',
                description: `The Counter-Strike 1.6 server ${address} was not found`,
            };
        }
        return {
            title: serverData[0].servername,
            description: `Counter-Strike 1.6 server ${address}: ${serverData[0].servername}. Players: ${serverData[0].numplayers}/${serverData[0].maxplayers}. Map: ${serverData[0].map}`,
            openGraph: {
                title: serverData[0].servername,
                description: `Counter-Strike 1.6 server ${address}: ${serverData[0].servername}`,
                images: [`/server_info/${address}/argstrike_v1.png`],
            },
        };
    }
    catch (error) {
        console.error('Error fetching server metadata:', error);
        return {
            title: 'Server Details',
            description: 'Counter-Strike 1.6 Server',
        };
    }
}
async function ServerPage({ params }) {
    const { address } = params;
    try {
        const [host, port] = address.split(':');
        const serverData = await (0, servers_1.getServerDetails)(host, port);
        if (!serverData || serverData.length === 0) {
            (0, navigation_1.notFound)();
        }
        return (<react_1.Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>}>
        <server_details_1.default address={address} initialData={serverData[0]}/>
      </react_1.Suspense>);
    }
    catch (error) {
        console.error('Error fetching server data:', error);
        return (0, navigation_1.notFound)();
    }
}
//# sourceMappingURL=page.js.map