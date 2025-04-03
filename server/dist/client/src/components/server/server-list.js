'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerList;
const react_1 = require("react");
const link_1 = require("next/link");
const react_icons_1 = require("@radix-ui/react-icons");
const pagination_1 = require("@/components/ui/pagination");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const servers_1 = require("@/lib/api/servers");
function ServerList({ initialServers = [], initialTotalPages = 1, queryId, value, varValue, }) {
    const { t } = (0, useTranslation_1.useTranslation)();
    const [servers, setServers] = (0, react_1.useState)(initialServers);
    const [isLoading, setIsLoading] = (0, react_1.useState)(initialServers.length === 0);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [totalPages, setTotalPages] = (0, react_1.useState)(initialTotalPages);
    const [orderBy, setOrderBy] = (0, react_1.useState)(2);
    const [orderDirection, setOrderDirection] = (0, react_1.useState)(false);
    const orderColumns = ['rank_id', 'servername', 'numplayers', 'host', 'map'];
    (0, react_1.useEffect)(() => {
        if (initialServers.length === 0) {
            fetchServers();
        }
    }, [currentPage, queryId, value, varValue]);
    const fetchServers = async () => {
        setIsLoading(true);
        try {
            const response = await (0, servers_1.getServers)({
                queryId,
                value,
                varValue,
                page: currentPage,
                orderBy: orderColumns[orderBy],
                orderDirection: orderDirection ? 'desc' : 'asc',
            });
            setServers(response.servers);
            setTotalPages(response.totalPages);
        }
        catch (error) {
            console.error('Error fetching server data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSort = (index) => {
        setOrderBy(index);
        setOrderDirection(prev => !prev);
        const sortedServers = [...servers].sort((a, b) => {
            const valueA = typeof a[orderColumns[index]] === 'string'
                ? a[orderColumns[index]].toLowerCase()
                : a[orderColumns[index]];
            const valueB = typeof b[orderColumns[index]] === 'string'
                ? b[orderColumns[index]].toLowerCase()
                : b[orderColumns[index]];
            const statusA = a.status || 0;
            const statusB = b.status || 0;
            if (statusA === 0 && statusB !== 0) {
                return 1;
            }
            else if (statusA !== 0 && statusB === 0) {
                return -1;
            }
            else {
                if (typeof valueA === 'string') {
                    const comparison = orderDirection ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    if (comparison === 0) {
                        return b.numplayers - a.numplayers;
                    }
                    return comparison;
                }
                else {
                    return orderDirection ? valueA - valueB : valueB - valueA;
                }
            }
        });
        setServers(sortedServers);
    };
    const renderSortIcon = (columnIndex) => {
        if (orderBy !== columnIndex)
            return null;
        return orderDirection
            ? <react_icons_1.CaretDownIcon className="inline ml-1"/>
            : <react_icons_1.CaretUpIcon className="inline ml-1"/>;
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const getRankIcon = (index) => {
        if (index > 2)
            return null;
        const classes = [
            'text-amber-400',
            'text-gray-300',
            'text-amber-700',
        ];
        return <react_icons_1.CrownIcon className={`absolute left-1 top-1/2 transform -translate-y-1/2 ${classes[index]}`}/>;
    };
    return (<div className="flex flex-col items-center w-full">
      <pagination_1.default totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
      
      
      <div className="w-full md:w-4/5 overflow-x-auto">
        <table className="w-full border border-sky-500 border-collapse bg-sky-500 bg-opacity-90 text-white">
          <thead>
            <tr className="bg-sky-600">
              <th className="py-3 px-2 text-left text-sm md:text-base font-jersey cursor-pointer w-[10%] text-center" onClick={() => handleSort(2)}>
                {t('players')} {renderSortIcon(2)}
              </th>
              <th className="py-3 px-2 text-left text-sm md:text-base font-jersey cursor-pointer w-[40%]" onClick={() => handleSort(1)}>
                {t('server')} {renderSortIcon(1)}
              </th>
              <th className="py-3 px-2 text-left text-sm md:text-base font-jersey cursor-pointer w-[8%] text-center" onClick={() => handleSort(0)}>
                Rank {renderSortIcon(0)}
              </th>
              <th className="py-3 px-2 text-left text-sm md:text-base font-jersey cursor-pointer w-[20%]" onClick={() => handleSort(3)}>
                IP {renderSortIcon(3)}
              </th>
              <th className="py-3 px-2 text-left text-sm md:text-base font-jersey cursor-pointer w-[22%]" onClick={() => handleSort(4)}>
                {t('map')} {renderSortIcon(4)}
              </th>
            </tr>
          </thead>
        </table>
      
        
        <table className="w-full border border-sky-500 border-collapse bg-sky-500 bg-opacity-90 text-white">
          <tbody>
            {isLoading ? (<tr>
                <td colSpan={5} className="py-10 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                </td>
              </tr>) : servers.length > 0 ? (servers.map((server, index) => (<tr key={server.id || index} className={`
                    ${index % 2 === 0 ? 'bg-sky-400' : 'bg-sky-500'} 
                    ${server.status === 0 ? 'bg-red-700' : ''}
                    hover:bg-amber-400 transition-colors
                  `}>
                  <td className="py-2 px-2 text-center relative">
                    {server.status === 0 && index > 2 ? (<react_icons_1.SkullIcon className="absolute left-1 top-1/2 transform -translate-y-1/2"/>) : (((orderDirection === true && orderBy === 0) || (orderDirection === false && orderBy === 2)) &&
                getRankIcon(index))}
                    <span className="ml-4">
                      {server.numplayers}/{server.maxplayers}
                    </span>
                  </td>
                  <td className="py-2 px-2 truncate">
                    <link_1.default href={`/servidor/${server.host}:${server.port}`} className="hover:text-amber-200 truncate block">
                      {server.servername}
                    </link_1.default>
                  </td>
                  <td className="py-2 px-2 text-center">
                    {server.rank_id}
                  </td>
                  <td className="py-2 px-2 truncate">
                    {server.host}:{server.port}
                  </td>
                  <td className="py-2 px-2 truncate">
                    {server.map}
                  </td>
                </tr>))) : (<tr>
                <td colSpan={5} className="py-10 text-center">
                  {t('noServersFound')}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
//# sourceMappingURL=server-list.js.map