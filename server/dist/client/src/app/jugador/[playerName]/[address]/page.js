'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlayerServerStatsPage;
const react_1 = require("react");
const link_1 = require("next/link");
const react_icons_1 = require("@radix-ui/react-icons");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const players_1 = require("@/lib/api/players");
const formatters_1 = require("@/lib/utils/formatters");
const recharts_1 = require("recharts");
function PlayerServerStatsPage({ params }) {
    const { playerName, address } = params;
    const { t, locale } = (0, useTranslation_1.useTranslation)();
    const [playerData, setPlayerData] = (0, react_1.useState)([]);
    const [playerScore, setPlayerScore] = (0, react_1.useState)([]);
    const [playerTime, setPlayerTime] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [isLoadingChart, setIsLoadingChart] = (0, react_1.useState)(true);
    const [days, setDays] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        fetchData();
    }, [days]);
    const fetchData = async () => {
        try {
            const [host, port] = address.split(':');
            const response = await (0, players_1.getPlayerServerStats)(playerName, host, port, days);
            if (response.player_data && response.player_data.length > 0) {
                setPlayerData(response.player_data);
                if (locale === 'en' && response.player_score) {
                    response.player_score.Score = response.player_data[0].Puntaje;
                    delete response.player_data[0].Puntaje;
                }
                setPlayerScore(response.player_score || []);
                setPlayerTime(response.player_time || []);
            }
        }
        catch (error) {
            console.error('Error fetching player stats:', error);
        }
        finally {
            setIsLoading(false);
            setIsLoadingChart(false);
        }
    };
    const clickDays = (value) => {
        if (days === value)
            return;
        setIsLoadingChart(true);
        setDays(value);
    };
    const tickFormatter = (value, index, data) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return value;
        }
        if (data.length <= 4) {
            return value;
        }
        if (index % 4 !== 0) {
            return '';
        }
        return value;
    };
    const SimpleBarChart = ({ data, dataKey }) => {
        return (<recharts_1.ResponsiveContainer width="100%" height={250}>
        <recharts_1.BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <recharts_1.CartesianGrid strokeDasharray="3 3" stroke="#444"/>
          <recharts_1.XAxis dataKey={days === 0 ? "hour" : "day"} tickFormatter={(value, index) => tickFormatter(value, index, data)}/>
          <recharts_1.YAxis />
          {!isLoadingChart && <recharts_1.Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #444' }}/>}
          <recharts_1.Legend />
          <recharts_1.Bar dataKey={dataKey} fill="rgb(255, 184, 28)" barSize={10}/>
        </recharts_1.BarChart>
      </recharts_1.ResponsiveContainer>);
    };
    if (isLoading) {
        return (<div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>);
    }
    if (playerData.length === 0) {
        return (<div className="bg-black bg-opacity-70 w-[95%] md:w-4/5 mx-auto p-6 text-center">
        <div className="text-xl text-red-500 mb-4">
          {t('noInfoAvailable')}
        </div>
        <link_1.default href={`/jugador/${playerName}`} className="text-amber-400 hover:underline">
          &larr; {t('backToPlayerProfile')}
        </link_1.default>
      </div>);
    }
    return (<div className="flex flex-col md:flex-row justify-between w-[95%] md:w-4/5 mx-auto gap-4">
      
      <div className="flex-1">
        <div className="bg-black bg-opacity-70 border border-black border-opacity-70 px-6 py-2 z-10 mb-4">
          <link_1.default href={`/jugador/${playerName}`} className="flex items-center text-amber-400 hover:underline">
            <react_icons_1.ChevronLeftIcon className="mr-1"/>
            {playerName} {t('statistics')}
          </link_1.default>
        </div>
        
        <div className="bg-black bg-opacity-60 p-6 rounded">
          <div className="mb-6">
            <h3 className="text-sm uppercase text-amber-400 font-semibold mb-2">{t('summary')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                {t('firstSeen')}: <span className="text-amber-300">
                  {(0, formatters_1.formatDate)(playerData[0].first_seen, locale)}
                </span>
              </div>
              <div>
                {t('lastSeen')}: <span className="text-amber-300">
                  {(0, formatters_1.formatDate)(playerData[0].last_seen, locale)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm uppercase text-amber-400 font-semibold mb-2">
              {t('allTimeStatistics')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                {t('score')}: <span className="text-amber-300">{playerData[0].score}</span>
              </div>
              <div>
                {t('minutesPlayed')}: <span className="text-amber-300">
                  {parseInt(String(playerData[0].playtime / 60))}
                </span>
              </div>
              <div>
                {t('scorePerMinute')}: <span className="text-amber-300">
                  {(0, formatters_1.scorePerMinute)(playerData[0].score, playerData[0].playtime)}
                </span>
              </div>
              <div>
                {t('rankInServer')}: <span className="text-amber-300">
                  #{playerData[0].rank_id} {t('of')} #{playerData[0].rank_total}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm uppercase text-amber-400 font-semibold mb-2">
              {t('serverInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="col-span-1 md:col-span-2">
                {t('serverName')}: <link_1.default href={`/servidor/${address}`} className="text-sky-400 hover:underline">
                  {playerData[0].servername}
                </link_1.default>
              </div>
              <div>
                {t('status')}: <span className={playerData[0].status ? 'text-green-500' : 'text-red-500'}>
                  {playerData[0].status ? t('online') : t('offline')}
                </span>
              </div>
              <div>
                {t('ipAddress')}: <span className="text-amber-300">{playerData[0].host}</span>&nbsp;
                {t('port')}: <span className="text-amber-300">{playerData[0].port}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="flex-1">
        <div className="bg-black bg-opacity-70 border border-black border-opacity-70 px-6 py-2 z-10 mb-4">
          <h2 className="uppercase text-amber-400 font-semibold">
            {t('historicalData')}
          </h2>
        </div>
        
        <div className="bg-black bg-opacity-60 p-6 rounded">
          <div className="flex items-center justify-between mb-4">
            <div className="text-amber-400">{t('informationFor')}:</div>
            <div className="flex space-x-2">
              <button onClick={() => clickDays(0)} className={`px-3 py-1 text-xs rounded ${days === 0
            ? 'bg-amber-400 text-black'
            : 'bg-sky-500 text-white hover:bg-sky-600'} transition-colors`}>
                24 {t('hours')}
              </button>
              <button onClick={() => clickDays(7)} className={`px-3 py-1 text-xs rounded ${days === 7
            ? 'bg-amber-400 text-black'
            : 'bg-sky-500 text-white hover:bg-sky-600'} transition-colors`}>
                7 {t('days')}
              </button>
              <button onClick={() => clickDays(30)} className={`px-3 py-1 text-xs rounded ${days === 30
            ? 'bg-amber-400 text-black'
            : 'bg-sky-500 text-white hover:bg-sky-600'} transition-colors`}>
                30 {t('days')}
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm uppercase text-amber-400 font-semibold mb-2">
              {t('score')}:
            </h3>
            <div className="relative h-64">
              {!isLoadingChart && playerScore.length <= 0 && (<div className="absolute inset-0 flex items-center justify-center text-amber-400">
                  {t('noInfoAvailable')}
                </div>)}
              {isLoadingChart && (<div className="absolute inset-0 flex items-center justify-center">
                  <react_icons_1.ReloadIcon className="animate-spin text-amber-400 h-8 w-8"/>
                </div>)}
              <SimpleBarChart data={isLoadingChart ? [] : playerScore} dataKey="Puntaje"/>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm uppercase text-amber-400 font-semibold mb-2">
              {t('timePlayed')}:
            </h3>
            <div className="relative h-64">
              {!isLoadingChart && playerTime.length <= 0 && (<div className="absolute inset-0 flex items-center justify-center text-amber-400">
                  {t('noInfoAvailable')}
                </div>)}
              {isLoadingChart && (<div className="absolute inset-0 flex items-center justify-center">
                  <react_icons_1.ReloadIcon className="animate-spin text-amber-400 h-8 w-8"/>
                </div>)}
              <SimpleBarChart data={isLoadingChart ? [] : playerTime} dataKey="Tiempo"/>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map