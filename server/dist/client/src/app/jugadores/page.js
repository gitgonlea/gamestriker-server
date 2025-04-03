'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlayersPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = require("next/link");
const react_icons_1 = require("@radix-ui/react-icons");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const search_bar_1 = require("@/components/search/search-bar");
const pagination_1 = require("@/components/ui/pagination");
const players_1 = require("@/lib/api/players");
function PlayersPage({ searchParams }) {
    const { t } = (0, useTranslation_1.useTranslation)();
    const urlSearchParams = (0, navigation_1.useSearchParams)();
    const initialName = (searchParams === null || searchParams === void 0 ? void 0 : searchParams.name) || urlSearchParams.get('name') || '';
    const initialOnline = (searchParams === null || searchParams === void 0 ? void 0 : searchParams.online) === 'true' || urlSearchParams.get('online') === 'true';
    const [selectedValue, setSelectedValue] = (0, react_1.useState)(initialOnline ? '4' : '3');
    const [searchValue, setSearchValue] = (0, react_1.useState)(initialName);
    const [isOnline, setIsOnline] = (0, react_1.useState)(initialOnline);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [orderDirection, setOrderDirection] = (0, react_1.useState)(false);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [totalPages, setTotalPages] = (0, react_1.useState)(1);
    const [players, setPlayers] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        fetchPlayers();
    }, [currentPage, isOnline, searchValue]);
    const fetchPlayers = async () => {
        setIsLoading(true);
        try {
            const response = await (0, players_1.getPlayers)({
                name: searchValue,
                online: isOnline,
                page: currentPage,
            });
            setPlayers(response.players);
            setTotalPages(response.totalPages);
        }
        catch (error) {
            console.error('Error fetching players:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCellClick = () => {
        setOrderDirection(prev => !prev);
        const sortedPlayers = [...players].sort((a, b) => {
            const valueA = a.player_name.toLowerCase();
            const valueB = b.player_name.toLowerCase();
            return orderDirection
                ? valueB.localeCompare(valueA)
                : valueA.localeCompare(valueB);
        });
        setPlayers(sortedPlayers);
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleSearch = (value, isOnlineSearch = false) => {
        setSearchValue(value);
        setIsOnline(isOnlineSearch);
        setCurrentPage(1);
    };
    return (<main className="flex flex-col items-center">
      <search_bar_1.default initialSelectedValue={selectedValue} initialSearchValue={searchValue} onSearch={(value, type) => {
            handleSearch(value, type === '4');
        }}/>
      
      <pagination_1.default totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
      
      
      <div className="w-full md:w-4/5 overflow-x-auto">
        <table className="w-full border border-sky-500 border-collapse bg-sky-500 bg-opacity-90 text-white">
          <thead>
            <tr className="bg-sky-600">
              <th className="py-3 px-2 text-left text-sm md:text-base font-jersey cursor-pointer w-full" onClick={handleCellClick}>
                {!orderDirection ?
            <react_icons_1.CaretUpIcon className="inline-block mr-1"/> :
            <react_icons_1.CaretDownIcon className="inline-block mr-1"/>}
                {t('name')}
              </th>
            </tr>
          </thead>
        </table>

        <table className="w-full border border-sky-500 border-collapse bg-sky-500 bg-opacity-90 text-white">
          <tbody>
            {isLoading ? (<tr>
                <td className="py-10 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                </td>
              </tr>) : players.length > 0 ? (players.map((player, index) => (<tr key={player.id || index} className={`${index % 2 === 0 ? 'bg-sky-400' : 'bg-sky-500'} hover:bg-amber-400 transition-colors`}>
                  <td className="py-2 px-4">
                    <link_1.default href={`/jugador/${player.player_name}`} className="hover:text-amber-200">
                      {player.player_name}
                    </link_1.default>
                  </td>
                </tr>))) : (<tr>
                <td className="py-10 text-center">
                  {t('noPlayersFound')}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </main>);
}
//# sourceMappingURL=page.js.map