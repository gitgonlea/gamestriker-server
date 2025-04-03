"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = generateMetadata;
exports.default = SearchPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const search_bar_1 = require("@/components/search/search-bar");
const server_list_1 = require("@/components/server/server-list");
const servers_1 = require("@/lib/api/servers");
async function generateMetadata({ params }) {
    const { queryId, value, varValue } = params;
    let searchType = '';
    switch (queryId) {
        case 'name':
            searchType = 'Server Name';
            break;
        case 'map':
            searchType = 'Map';
            break;
        case 'ip':
            searchType = 'IP Address';
            break;
        case 'variable':
            searchType = 'Server Variable';
            break;
        default:
            searchType = 'Search';
    }
    return {
        title: `${searchType} Search: ${value}${varValue ? ' = ' + varValue : ''}`,
        description: `Counter-Strike 1.6 servers matching ${searchType.toLowerCase()}: ${value}${varValue ? ' = ' + varValue : ''}`,
    };
}
async function SearchPage({ params }) {
    const { queryId, value, varValue } = params;
    try {
        const serverData = await (0, servers_1.getServers)({
            queryId,
            value,
            varValue,
        });
        return (<div className="flex flex-col items-center">
        <search_bar_1.default initialSelectedValue={queryId === 'name' ? '0' :
                queryId === 'map' ? '1' :
                    queryId === 'ip' ? '2' :
                        queryId === 'variable' ? '5' : '0'} initialSearchValue={value} isVariable={queryId === 'variable' ? value : undefined}/>
        
        <react_1.Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>}>
          <server_list_1.default initialServers={serverData.servers} initialTotalPages={serverData.totalPages} queryId={queryId} value={value} varValue={varValue}/>
        </react_1.Suspense>
      </div>);
    }
    catch (error) {
        console.error('Error fetching search results:', error);
        return (0, navigation_1.notFound)();
    }
}
//# sourceMappingURL=page.js.map