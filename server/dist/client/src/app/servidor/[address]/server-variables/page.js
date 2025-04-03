'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerVariablesPage;
const react_1 = require("react");
const link_1 = require("next/link");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const react_icons_1 = require("@radix-ui/react-icons");
const servers_1 = require("@/lib/api/servers");
function ServerVariablesPage({ params }) {
    const { address } = params;
    const { t } = (0, useTranslation_1.useTranslation)();
    const [serverData, setServerData] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchVariables = async () => {
            setIsLoading(true);
            try {
                const [host, port] = address.split(':');
                const data = await (0, servers_1.getServerVariables)(host, port);
                setServerData(data);
            }
            catch (error) {
                console.error('Error fetching server variables:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchVariables();
    }, [address]);
    if (isLoading) {
        return (<div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>);
    }
    if (!serverData || serverData.length === 0 ||
        (serverData[0] &&
            (!serverData[0].variables_data ||
                Object.keys(JSON.parse(serverData[0].variables_data)).length === 0))) {
        return (<div className="bg-black bg-opacity-70 w-[95%] md:w-4/5 mx-auto">
        <div className="bg-black bg-opacity-60 p-3 flex items-center text-xl text-red-500 font-semibold uppercase">
          <react_icons_1.Cross2Icon className="mr-2"/>
          {t('noServerVariablesAvailable')}
        </div>
      </div>);
    }
    const variables = JSON.parse(serverData[0].variables_data);
    return (<div className="flex flex-col w-[95%] md:w-4/5 lg:w-2/3 mx-auto">
      
      <div className="bg-black bg-opacity-70 border border-black border-opacity-70 px-7 py-2 flex justify-between items-center">
        <div className="uppercase text-amber-400 text-base font-semibold flex items-center">
          <link_1.default href={`/servidor/${address}`} className="flex items-center hover:underline">
            <react_icons_1.ChevronLeftIcon className="mr-1"/>
            {serverData[0].servername}
          </link_1.default>
        </div>
        
        <div className="text-gray-400 text-sm">
          <link_1.default href={`/servidor/${address}`}>
            {serverData[0].host}:{serverData[0].port}
          </link_1.default>
        </div>
      </div>
      
      
      <div className="bg-black bg-opacity-70 border border-black border-opacity-70 px-7 py-2 flex justify-between items-center mt-2">
        <div className="uppercase text-amber-400 text-base font-semibold">
          {t('serverVariables')}
        </div>
        
        <div className="text-gray-400 text-sm">
          {t('updatedEvery24Hours')}
        </div>
      </div>
      
      
      <div className="bg-black bg-opacity-60 p-4">
        {Object.entries(variables).map(([key, value]) => (<div key={key} className="flex justify-between border-b border-gray-800 py-2 hover:bg-black hover:bg-opacity-30 transition-colors">
            <div className="font-mono">{key}</div>
            <div>
              <link_1.default href={`/search/variable/${key}/${value}`} className="text-amber-400 hover:underline">
                {String(value)}
              </link_1.default>
            </div>
          </div>))}
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map