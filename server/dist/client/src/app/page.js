"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
const react_1 = require("react");
const search_bar_1 = require("@/components/search/search-bar");
const server_list_1 = require("@/components/server/server-list");
const servers_1 = require("@/lib/api/servers");
async function HomePage() {
    const serverData = await (0, servers_1.getServers)({
        orderBy: 'numplayers',
        orderDirection: 'desc',
    });
    return (<div className="flex flex-col items-center">
      <search_bar_1.default />
      
      <react_1.Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>}>
        <server_list_1.default initialServers={serverData.servers} initialTotalPages={serverData.totalPages}/>
      </react_1.Suspense>
    </div>);
}
//# sourceMappingURL=page.js.map