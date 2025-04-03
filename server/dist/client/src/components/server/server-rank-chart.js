'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerRankChart;
const react_1 = require("react");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const recharts_1 = require("recharts");
const react_icons_1 = require("@radix-ui/react-icons");
const servers_1 = require("@/lib/api/servers");
function ServerRankChart({ serverId }) {
    const { t } = (0, useTranslation_1.useTranslation)();
    const [rankStats, setRankStats] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        fetchRankStats();
    }, [serverId]);
    const fetchRankStats = async () => {
        setIsLoading(true);
        try {
            const data = await (0, servers_1.getRankStats)(serverId);
            setRankStats(data);
        }
        catch (error) {
            console.error('Error fetching rank stats:', error);
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
    if (rankStats.length === 0) {
        return (<div className="flex justify-center items-center h-64 bg-black bg-opacity-70 rounded">
        <p className="text-amber-400">{t('noInfoAvailable')}</p>
      </div>);
    }
    return (<div className="bg-black bg-opacity-70 rounded h-64">
      <recharts_1.ResponsiveContainer width="100%" height="100%">
        <recharts_1.LineChart data={rankStats} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444"/>
          <recharts_1.XAxis dataKey="date" interval={0} tick={{ fontSize: 12, angle: -45 }}/>
          <recharts_1.YAxis type="number" domain={[200, 1]} allowDataOverflow={true} label={{
            value: t('rank'),
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
        }}/>
          <recharts_1.Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #444' }}/>
          <recharts_1.Legend />
          <recharts_1.Line type="monotone" dataKey="Rank" stroke="rgba(41, 217, 145, 0.8)" activeDot={{ r: 8 }} strokeWidth={2}/>
        </recharts_1.LineChart>
      </recharts_1.ResponsiveContainer>
    </div>);
}
//# sourceMappingURL=server-rank-chart.js.map