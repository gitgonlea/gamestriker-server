'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerDetails;
const react_1 = require("react");
const link_1 = require("next/link");
const image_1 = require("next/image");
const navigation_1 = require("next/navigation");
const react_icons_1 = require("@radix-ui/react-icons");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const formatters_1 = require("@/lib/utils/formatters");
const validators_1 = require("@/lib/utils/validators");
const servers_1 = require("@/lib/api/servers");
const server_banner_1 = require("./server-banner");
const server_map_charts_1 = require("./server-map-charts");
const server_player_stats_1 = require("./server-player-stats");
const server_rank_chart_1 = require("./server-rank-chart");
function ServerDetails({ address, initialData }) {
    var _a, _b, _c, _d;
    const { t, locale } = (0, useTranslation_1.useTranslation)();
    const router = (0, navigation_1.useRouter)();
    const [serverData, setServerData] = (0, react_1.useState)(initialData || null);
    const [playerList, setPlayerList] = (0, react_1.useState)([]);
    const [topList, setTopList] = (0, react_1.useState)([]);
    const [elapsedTime, setElapsedTime] = (0, react_1.useState)(0);
    const [isLoading, setIsLoading] = (0, react_1.useState)(!initialData);
    const [imageMap, setImageMap] = (0, react_1.useState)('');
    const [playerListOrderBy, setPlayerListOrderBy] = (0, react_1.useState)(2);
    const [topListOrderBy, setTopListOrderBy] = (0, react_1.useState)(2);
    const [playerListOrderDirection, setPlayerListOrderDirection] = (0, react_1.useState)(false);
    const [topListOrderDirection, setTopListOrderDirection] = (0, react_1.useState)(false);
    const [hoursSelected, setHoursSelected] = (0, react_1.useState)(0);
    const [invalidAddress, setInvalidAddress] = (0, react_1.useState)(false);
    const [timestampBanner, setTimestampBanner] = (0, react_1.useState)(Date.now());
    const [lastUpdateInterval, setLastUpdateInterval] = (0, react_1.useState)(null);
    const orderColumns = ['rank', 'player_name', 'score', 'playtime'];
    (0, react_1.useEffect)(() => {
        if (!initialData) {
            fetchServerData();
        }
        else {
            setupMapImage();
            setupLastUpdateInterval();
        }
        return () => {
            if (lastUpdateInterval)
                clearInterval(lastUpdateInterval);
        };
    }, [address]);
    const setupLastUpdateInterval = () => {
        if (serverData && serverData.last_update) {
            const lastUpdateDateTime = new Date(serverData.last_update);
            const lastUpdateTimestamp = lastUpdateDateTime.getTime();
            if (lastUpdateTimestamp) {
                const interval = setInterval(() => {
                    const now = new Date();
                    const differenceInMilliseconds = Math.abs(lastUpdateTimestamp - now.getTime());
                    const difference = differenceInMilliseconds / 1000;
                    setElapsedTime(difference);
                }, 1000);
                setLastUpdateInterval(interval);
            }
        }
    };
    const setupMapImage = () => {
        if (serverData && serverData.map) {
            setImageMap(`/maps/${serverData.map}.jfif`);
        }
    };
    const fetchServerData = async () => {
        setIsLoading(true);
        try {
            const [host, port] = address.split(':');
            if (!(0, validators_1.isValidIpAddress)(host) || !(0, validators_1.isValidPort)(port)) {
                setInvalidAddress(true);
                setIsLoading(false);
                return;
            }
            const data = await (0, servers_1.getServerDetails)(host, port);
            if (!data || data.length === 0) {
                setIsLoading(false);
                return;
            }
            setServerData(data[0]);
            document.title = data[0].servername;
            setTimestampBanner(Date.now());
            setImageMap(`/maps/${data[0].map}.jfif`);
            if (data[0].id) {
                fetchPlayers(data[0].id);
                fetchTop(data[0].id);
            }
            setupLastUpdateInterval();
        }
        catch (error) {
            console.error('Error fetching server data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const fetchPlayers = async (serverId) => {
        try {
            const players = await (0, servers_1.getServerPlayers)(serverId);
            assignRanks(players, 0);
        }
        catch (error) {
            console.error('Error fetching server players:', error);
        }
    };
    const fetchTop = async (serverId) => {
        try {
            const topPlayers = await (0, servers_1.getServerTop)(serverId);
            assignRanks(topPlayers, 1);
        }
        catch (error) {
            console.error('Error fetching top players:', error);
        }
    };
    const assignRanks = (data, type) => {
        if (!data || data.length === 0) {
            return;
        }
        const scoreProperty = type === 1 ? 'score' : 'current_score';
        const sortedData = [...data].sort((a, b) => b[scoreProperty] - a[scoreProperty]);
        let currentRank = 1;
        let currentScore = sortedData[0][scoreProperty];
        sortedData.forEach((item, index) => {
            if (item[scoreProperty] < currentScore) {
                currentRank = index + 1;
                currentScore = item[scoreProperty];
            }
            item.rank = currentRank;
        });
        if (type === 1) {
            setTopList(sortedData);
        }
        else {
            setPlayerList(sortedData);
        }
    };
    const handleCellClick = (index, type) => {
        if (type) {
            setPlayerListOrderDirection(prev => !prev);
            setPlayerListOrderBy(index);
            setPlayerList(orderPlayerData(index, type));
        }
        else {
            setTopListOrderDirection(prev => !prev);
            setTopListOrderBy(index);
            setTopList(orderPlayerData(index, type));
        }
    };
    const orderPlayerData = (oid, type) => {
        const dataList = type ? playerList : topList;
        const orderDirection = type ? playerListOrderDirection : topListOrderDirection;
        return [...dataList].sort((a, b) => {
            const valueA = typeof a[orderColumns[oid]] === 'string'
                ? a[orderColumns[oid]].toLowerCase()
                : a[orderColumns[oid]];
            const valueB = typeof b[orderColumns[oid]] === 'string'
                ? b[orderColumns[oid]].toLowerCase()
                : b[orderColumns[oid]];
            if (typeof valueA === 'string') {
                return orderDirection
                    ? valueB.localeCompare(valueA)
                    : valueA.localeCompare(valueB);
            }
            else {
                return orderDirection
                    ? valueB - valueA
                    : valueA - valueB;
            }
        });
    };
    const renderSortIcon = (columnIndex, type) => {
        const orderBy = type ? playerListOrderBy : topListOrderBy;
        const orderDirection = type ? playerListOrderDirection : topListOrderDirection;
        if (orderBy !== columnIndex)
            return null;
        return orderDirection
            ? <react_icons_1.CaretDownIcon className="inline-block ml-1"/>
            : <react_icons_1.CaretUpIcon className="inline-block ml-1"/>;
    };
    const handleImageError = () => {
        setImageMap('notfound');
    };
    if (isLoading) {
        return (<div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>);
    }
    if (!serverData || invalidAddress) {
        return (<div className="bg-black bg-opacity-70 w-[95%] md:w-4/5 mx-auto">
        <div className="bg-black bg-opacity-70 p-3 flex items-center text-xl text-red-500 font-semibold uppercase">
          <react_icons_1.Cross2Icon className="mr-2"/>
          {invalidAddress
                ? t('invalidServerAddress', { address })
                : t('serverNotFound')}
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            {invalidAddress
                ? t('invalidAddressMessage', { address })
                : t('serverNotFoundReason')}
          </div>
          
          {!invalidAddress && (<ul className="list-disc ml-6 space-y-1">
              <li>{t('badUrlReason')}</li>
              <li>{t('ipChangedReason')}</li>
              <li>{t('serverDeletedReason')}</li>
            </ul>)}
        </div>
      </div>);
    }
    return (<div className="flex flex-col lg:flex-row justify-between w-[95%] md:w-4/5 mx-auto">
      
      <div className="flex-grow lg:w-7/10 lg:mr-4">
        
        <div className="bg-black bg-opacity-70 border border-black border-opacity-70 px-6 py-2 flex justify-between items-center z-10">
          <h2 className="uppercase text-amber-400 text-lg font-semibold">
            {t('serverDetails')}
          </h2>
          
          {elapsedTime !== 0 && (<div className="text-gray-300 text-sm">
              {t('lastScanned')} {(0, formatters_1.formatTime)(elapsedTime, 1, 1)} {t('ago')}
            </div>)}
        </div>
        
        
        <div className="bg-black bg-opacity-60 p-6 rounded">
          <div className="flex flex-col md:flex-row justify-between">
            
            <div className="relative max-w-[60%] z-10">
              <div className="mb-2">
                <span className="text-amber-400 font-semibold">{t('name')}: </span>
                <span>{serverData.servername}</span>
              </div>
              
              <div className="mb-2">
                <span>IP: </span>
                <span className="text-amber-400">{serverData.host}</span>
                &nbsp;&nbsp;{t('port')}: <span className="text-amber-400">{serverData.port}</span>
              </div>
              
              <div className="mb-4">
                {t('status')}: 
                <span className={`ml-2 ${serverData.status ? 'text-green-500' : 'text-red-500'}`}>
                  {serverData.status ? t('online') : t('offline')} 
                  <react_icons_1.GlobeIcon className="inline ml-1"/>
                </span>
              </div>
              
              
              <div className="uppercase text-amber-400 font-semibold mb-2 server-vars">
                <link_1.default href={`/servidor/${address}/server-variables`} className="flex items-center">
                  <react_icons_1.GearIcon className="mr-1"/> {t('serverVariables')}
                </link_1.default>
              </div>
              
              
              <div className="uppercase text-amber-400 font-semibold mb-1">
                {t('ranking')}
              </div>
              
              <div className="mb-1">
                {t('serverRank')}: 
                <span className="text-amber-400 ml-1">
                  {serverData.rank_id}º ({serverData.percentile}º {t('percentile')})
                </span>
              </div>
              
              
              <div className="w-[90%] h-8 border border-gray-400 bg-gradient-to-r from-sky-500 via-white to-amber-400 mb-2">
                <div className="h-full flex items-center justify-end" style={{ width: `${serverData.percentile}%` }}>
                  <span className="bg-black px-1 py-0.5 text-xs rounded mr-1">
                    {serverData.percentile}º
                  </span>
                </div>
              </div>
              
              
              <div className="flex justify-between text-sm">
                <div>
                  {t('higherPastMonth')}:
                  <span className="text-amber-400 ml-1">
                    {((_b = (_a = serverData.ServerRanks) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.lowest_rank) > 0
            ? `${serverData.ServerRanks[0].lowest_rank}º`
            : (<span className="text-white">
                          <react_icons_1.QuestionMarkCircledIcon className="inline" title={t('noInfoAvailable')}/>
                        </span>)}
                  </span>
                </div>
                
                <div className="ml-8">
                  {t('lowerPastMonth')}:
                  <span className="text-amber-400 ml-1">
                    {((_d = (_c = serverData.ServerRanks) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.highest_rank) > 0
            ? `${serverData.ServerRanks[0].highest_rank}º`
            : (<span className="text-white">
                          <react_icons_1.QuestionMarkCircledIcon className="inline" title={t('noInfoAvailable')}/>
                        </span>)}
                  </span>
                </div>
              </div>
            </div>
            
            
            <div className="md:mr-4">
              <div className="text-sm text-green-400 font-semibold uppercase">
                {t('currentMap')}:
              </div>
              
              <div className="bg-black bg-opacity-60 border border-black border-opacity-60 p-1 rounded">
                {serverData.status === 0 ? (<div className="flex items-center justify-center text-red-500">
                    {t('unknown')}
                    <react_icons_1.Cross2Icon className="ml-1"/>
                  </div>) : (<>
                    <div className="bg-black border border-black text-xs p-1">
                      {serverData.map}
                    </div>
                    
                    {imageMap && (imageMap === 'notfound' ? (<div className="text-center mt-1 text-2xl">
                          <react_icons_1.EyeClosedIcon />
                        </div>) : (<image_1.default src={imageMap} alt={serverData.map} width={160} height={120} className="w-full h-auto" onError={handleImageError}/>))}
                  </>)}
              </div>
              
              <div className="mt-1 text-sm text-green-400">
                {t('players')}:&nbsp;
                <span className="text-white">
                  {serverData.numplayers}/{serverData.maxplayers}
                </span>
              </div>
              
              <div className="text-sm text-green-400">
                {t('averageLastMonth')}:&nbsp;
                {serverData.monthly_avg > 0 ? (<span className="text-white">
                    {serverData.monthly_avg}
                  </span>) : (<span className="text-white">
                    <react_icons_1.QuestionMarkCircledIcon className="inline" title={t('noInfoAvailable')}/>
                  </span>)}
              </div>
            </div>
          </div>
          
          
          <div className="mt-4">
            <h3 className="uppercase text-amber-400 font-semibold mb-1">
              {t('serverBanner')}
            </h3>
            
            <server_banner_1.default address={address} timestamp={timestampBanner}/>
          </div>
          
          
          <div className="mt-4">
            <h3 className="uppercase text-amber-400 font-semibold mb-1">
              {t('playersOnline')}
            </h3>
            
            <table className="w-full md:w-3/4 border border-sky-500 border-collapse bg-sky-500 bg-opacity-90 text-white">
              <thead>
                <tr className="bg-sky-600">
                  <th className="p-2 text-left cursor-pointer w-[8%]" onClick={() => handleCellClick(0, true)}>
                    Rank {renderSortIcon(0, true)}
                  </th>
                  <th className="p-2 text-left cursor-pointer w-[60%]" onClick={() => handleCellClick(1, true)}>
                    {t('name')} {renderSortIcon(1, true)}
                  </th>
                  <th className="p-2 text-left cursor-pointer w-[18%]" onClick={() => handleCellClick(2, true)}>
                    {t('score')} {renderSortIcon(2, true)}
                  </th>
                  <th className="p-2 text-left cursor-pointer w-[15%]" onClick={() => handleCellClick(3, true)}>
                    {t('timePlayed')} {renderSortIcon(3, true)}
                  </th>
                </tr>
              </thead>
            </table>
            
            <table className="w-full md:w-3/4 border border-sky-500 border-collapse bg-sky-500 bg-opacity-90 text-white">
              <tbody>
                {playerList.length > 0 ? (playerList.map((player, index) => (<tr key={`player-${index}`} className={`${index % 2 === 0 ? 'bg-sky-400' : 'bg-sky-500'} hover:bg-amber-400`}>
                      <td className="p-2 w-[8%]">{player.rank}</td>
                      <td className="p-2 w-[60%] truncate">
                        <link_1.default href={`/jugador/${player.player_name}/${address}`} className="block truncate">
                          {player.player_name} 
                          {player.BOT === 1 && (<span className="text-amber-400 text-shadow"> (BOT)</span>)}
                        </link_1.default>
                      </td>
                      <td className="p-2 w-[18%]">{player.current_score}</td>
                      <td className="p-2 w-[15%]">{(0, formatters_1.formatTime)(player.current_playtime, 1, 0)}</td>
                    </tr>))) : (<tr className="bg-sky-400">
                    <td colSpan={4} className="p-3 text-center">
                      {t('noPlayersOnline')}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          
          
          <div className="mt-4">
            <h3 className="uppercase text-amber-400 font-semibold mb-1">
              {t('top10Players')} ({t('onlineAndOffline')})
            </h3>
            
            <table className="w-full md:w-3/4 border border-sky-500 border-collapse bg-sky-500 bg-opacity-90 text-white">
              <thead>
                <tr className="bg-sky-600">
                  <th className="p-2 text-left cursor-pointer w-[8%]" onClick={() => handleCellClick(0, false)}>
                    Rank {renderSortIcon(0, false)}
                  </th>
                  <th className="p-2 text-left cursor-pointer w-[60%]" onClick={() => handleCellClick(1, false)}>
                    {t('name')} {renderSortIcon(1, false)}
                  </th>
                  <th className="p-2 text-left cursor-pointer w-[18%]" onClick={() => handleCellClick(2, false)}>
                    {t('score')} {renderSortIcon(2, false)}
                  </th>
                  <th className="p-2 text-left cursor-pointer w-[15%]" onClick={() => handleCellClick(3, false)}>
                    {t('timePlayed')} {renderSortIcon(3, false)}
                  </th>
                </tr>
              </thead>
            </table>
            
            <table className="w-full md:w-3/4 border border-sky-500 border-collapse bg-sky-500 bg-opacity-90 text-white">
              <tbody>
                {topList.length > 0 ? (topList.map((player, index) => (<tr key={`top-${index}`} className={`${index % 2 === 0 ? 'bg-sky-400' : 'bg-sky-500'} hover:bg-amber-400`}>
                      <td className="p-2 w-[8%]">{player.rank}</td>
                      <td className="p-2 w-[60%] truncate">
                        <link_1.default href={`/jugador/${player.player_name}/${address}`} className="block truncate">
                          {player.player_name}
                        </link_1.default>
                      </td>
                      <td className="p-2 w-[18%]">{player.score}</td>
                      <td className="p-2 w-[15%]">{(0, formatters_1.formatTime)(player.playtime, 0, 0)}</td>
                    </tr>))) : (<tr className="bg-sky-400">
                    <td colSpan={4} className="p-3 text-center">
                      {t('noInfoAvailable')}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      
      <div className="mt-4 lg:mt-0 lg:w-3/10 bg-black bg-opacity-60">
        <div className="bg-black bg-opacity-60 p-2 uppercase text-amber-400 font-semibold">
          {t('historicalData')}
        </div>
        
        
        <div className="p-4">
          <div className="flex justify-between w-[90%] text-green-400">
            <div className="text-base">{t('favoriteMaps')}</div>
            <div className="text-sm">{t('lastWeek')}</div>
          </div>
          
          <server_map_charts_1.default serverData={serverData}/>
        </div>
        
        
        <div className="p-4 mt-6">
          <div className="flex justify-between w-[90%] text-green-400">
            <div className="text-base">{t('players')}</div>
            <div className="text-sm">
              {t('past')}: 
              <button className={`ml-1 ${hoursSelected === 0 ? 'text-white' : 'text-green-400'} hover:text-white transition-colors`} onClick={() => setHoursSelected(0)}>
                24 {t('hours')}
              </button> | 
              <button className={`ml-1 ${hoursSelected === 1 ? 'text-white' : 'text-green-400'} hover:text-white transition-colors`} onClick={() => setHoursSelected(1)}>
                7 {t('days')}
              </button>
            </div>
          </div>
          
          <server_player_stats_1.default serverId={serverData.id} hoursSelected={hoursSelected} currentPlayers={playerList.length}/>
        </div>
        
        
        <div className="p-4 mt-6">
          <div className="flex justify-between w-[90%] text-green-400">
            <div className="text-base">{t('serverRank')}</div>
            <div className="text-sm">30 {t('days')}</div>
          </div>
          
          <server_rank_chart_1.default serverId={serverData.id}/>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=server-details.js.map