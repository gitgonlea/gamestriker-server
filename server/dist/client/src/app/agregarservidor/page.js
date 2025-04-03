'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddServerPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const react_icons_1 = require("@radix-ui/react-icons");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const search_bar_1 = require("@/components/search/search-bar");
const servers_1 = require("@/lib/api/servers");
function AddServerPage() {
    const router = (0, navigation_1.useRouter)();
    const { t } = (0, useTranslation_1.useTranslation)();
    const [selectedValue, setSelectedValue] = (0, react_1.useState)('0');
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const [formData, setFormData] = (0, react_1.useState)({
        host: '',
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [responseStatus, setResponseStatus] = (0, react_1.useState)('');
    const [responseColor, setResponseColor] = (0, react_1.useState)(false);
    const [countdown, setCountdown] = (0, react_1.useState)(-1);
    const [savedAddress, setSavedAddress] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        let timer;
        if (responseStatus && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }
        else if (countdown === 0) {
            router.push(`/servidor/${savedAddress}`);
        }
        return () => clearInterval(timer);
    }, [responseStatus, countdown, router, savedAddress]);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(Object.assign(Object.assign({}, formData), { [name]: value }));
    };
    const handleAddServer = async () => {
        if (isLoading)
            return;
        if (!formData.host || !/^[\w.-]+:\d+$/.test(formData.host.trim())) {
            setResponseStatus(t('completeFieldsCorrectly'));
            setResponseColor(false);
            return;
        }
        setIsLoading(true);
        try {
            const response = await (0, servers_1.addServer)(formData);
            if (response === 'fail') {
                setResponseStatus(t('invalidIpOrPort'));
                setResponseColor(false);
            }
            else if (response === 'duplicated') {
                setResponseStatus(t('serverAlreadyInDatabase'));
                setResponseColor(false);
            }
            else {
                setFormData({
                    host: '',
                });
                setResponseStatus(t('serverAddedSuccessfully'));
                setResponseColor(true);
                setSavedAddress(`${response.host}:${response.port}`);
                setCountdown(10);
            }
        }
        catch (error) {
            console.error('Error:', error);
            setResponseStatus(t('errorAddingServer'));
            setResponseColor(false);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<main className="flex flex-col items-center">
      <search_bar_1.default initialSelectedValue={selectedValue} initialSearchValue={searchValue}/>
      
      <div className="w-[95%] md:w-1/2 bg-black bg-opacity-80 rounded">
        <div className="bg-black bg-opacity-70 border border-black border-opacity-70 px-7 py-2 relative z-10 flex justify-between items-center">
          <div className="uppercase text-amber-400 text-base font-semibold">
            {t('addServer')}
          </div>
          
          {countdown > 0 && (<div className="text-green-500 text-xs font-semibold flex items-center">
              {t('redirectingToServer')} {countdown} {countdown === 1 ? t('second') : t('seconds')}
              <react_icons_1.ReloadIcon className="animate-spin ml-1"/>
            </div>)}
        </div>
        
        <div className="flex md:flex-row flex-col p-6">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <div className="mb-2">
              <span>{t('ipOrDomainPort')}</span>
            </div>
          </div>
          
          <div className="md:w-2/3 flex flex-col">
            <input className="p-2 bg-gray-100 text-black mb-4 rounded" placeholder="127.0.0.1:27015" type="text" name="host" value={formData.host} onChange={handleInputChange}/>
            
            <button onClick={handleAddServer} className="py-2 px-4 bg-amber-400 text-black font-bold uppercase rounded hover:bg-amber-500 transition-colors w-36">
              {isLoading ? (<react_icons_1.ReloadIcon className="animate-spin mx-auto"/>) : (t('addServer'))}
            </button>
          </div>
        </div>
        
        {responseStatus && (<div className={`text-center pb-10 font-semibold ${responseColor ? 'text-green-500' : 'text-red-500'}`}>
            {responseStatus}
          </div>)}
      </div>
    </main>);
}
//# sourceMappingURL=page.js.map