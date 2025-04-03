'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerPlayerStats;
const react_1 = require("react");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const recharts_1 = require("recharts");
const react_icons_1 = require("@radix-ui/react-icons");
const servers_1 = require("@/lib/api/servers");
const formatters_1 = require("@/lib/utils/formatters");
function ServerPlayerStats({ serverId, hoursSelected, currentPlayers }) {
    const { t, locale } = (0, useTranslation_1.useTranslation)();
    const [playerStats, setPlayerStats] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        fetchPlayerStats();
    }, [hoursSelected, serverId]);
    const fetchPlayerStats = async () => {
        setIsLoading(true);
        try {
            const data = await (0, servers_1.getPlayerStats)(serverId, hoursSelected);
            if (hoursSelected === 0) {
                const todayData = {
                    day: '1',
                    hour: 'ahora',
                    Jugadores: currentPlayers,
                    Players: currentPlayers
                };
                data.push(todayData);
            }
            setPlayerStats(data);
        }
        catch (error) {
            console.error('Error fetching player stats:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return (<div className="flex justify-center items-center h-64 bg-black bg-opacity-70 rounded">
        <react_icons_1.ReloadIcon className="animate-spin h-8 w-8 text-amber-400"/>
      </div>);
    }
    if (playerStats.length === 0) {
        return (<div className="flex justify-center items-center h-64 bg-black bg-opacity-70 rounded">
        <p className="text-amber-400">{t('noInfoAvailable')}</p>
      </div>);
    }
    return (<div className="bg-black bg-opacity-70 rounded h-64">
      <recharts_1.ResponsiveContainer width="100%" height="100%">
        <recharts_1.LineChart data={playerStats} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444"/>
          <recharts_1.XAxis dataKey={hoursSelected === 0 ? "hour" : "day"} tickFormatter={(value, index) => (0, formatters_1.tickFormatter)(value, index, playerStats)}/>
          <recharts_1.YAxis />
          <recharts_1.Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #444' }}/>
          <recharts_1.Legend />
          <recharts_1.Line type="monotone" dataKey={locale === 'en' ? "Players" : "Jugadores"} stroke="rgba(41, 217, 145, 0.8)" activeDot={{ r: 8 }} strokeWidth={2}/>
        </recharts_1.LineChart>
      </recharts_1.ResponsiveContainer>
    </div>);
}
//# sourceMappingURL=server-player-stats.js.map