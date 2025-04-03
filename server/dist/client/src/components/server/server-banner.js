'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerBanner;
const react_1 = require("react");
const image_1 = require("next/image");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const react_icons_1 = require("@radix-ui/react-icons");
function ServerBanner({ address, timestamp }) {
    const { t } = (0, useTranslation_1.useTranslation)();
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [bannerValue, setBannerValue] = (0, react_1.useState)(false);
    const [copied, setCopied] = (0, react_1.useState)(false);
    const [bannerExample, setBannerExample] = (0, react_1.useState)('');
    const toggleModal = () => {
        if (!isModalOpen) {
            getBannerCode(false);
        }
        setIsModalOpen(!isModalOpen);
    };
    const getBannerCode = (value) => {
        if (!value) {
            setBannerExample(`<a href="https://argentina-strike.com/servidor/${address}/" target="_blank">` +
                `<img src="https://argentina-strike.com/server_info/${address}/argstrike_v1.png" ` +
                `border="0" width="350" height="20" alt=""/></a>`);
        }
        else {
            setBannerExample(`[url=https://argentina-strike.com/servidor/${address}/]` +
                `[img]https://argentina-strike.com/server_info/${address}/argstrike_v1.png[/img][/url]`);
        }
        setBannerValue(value);
        setCopied(false);
    };
    const handleClipboard = async () => {
        try {
            await navigator.clipboard.writeText(bannerExample);
            setCopied(true);
        }
        catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };
    return (<>
      <div className="cursor-pointer w-1/2 md:w-1/3" onClick={toggleModal}>
        <image_1.default src={`/server_info/${address}/argstrike_v1.png?timestamp=${timestamp}`} alt="Server Banner" width={350} height={20} className="w-full h-auto"/>
      </div>
      
      <div className="text-sm mt-1">
        CS 1.6 Banners: 
        <span className="text-amber-400 hover:underline cursor-pointer ml-1" onClick={toggleModal}>
          {t('getHtmlBannerCode')}
        </span>
      </div>
      
      
      {isModalOpen && (<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-black bg-opacity-90 p-4 rounded w-[90%] md:w-[600px]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex">
                <button className={`px-3 py-1 rounded bg-amber-400 text-black font-bold text-xs uppercase mr-2 ${!bannerValue ? 'opacity-100' : 'opacity-80'}`} onClick={() => getBannerCode(false)}>
                  WebSite/Blog
                </button>
                <button className={`px-3 py-1 rounded bg-amber-400 text-black font-bold text-xs uppercase ${bannerValue ? 'opacity-100' : 'opacity-80'}`} onClick={() => getBannerCode(true)}>
                  Foro
                </button>
              </div>
              
              <button onClick={toggleModal} className="text-xl">
                <react_icons_1.Cross2Icon />
              </button>
            </div>
            
            <div className="bg-black p-2 rounded">
              <textarea rows={8} className="w-full bg-black text-white p-2 resize-none outline-none border border-gray-800" value={bannerExample} readOnly/>
            </div>
            
            <div className="flex justify-center mt-2">
              <button onClick={handleClipboard} className="px-4 py-1 rounded bg-amber-400 text-black font-bold text-xs uppercase">
                {t('copy')}
              </button>
            </div>
            
            {copied && (<div className="text-center mt-2 text-green-500">
                {t('copiedSuccessfully')}
              </div>)}
          </div>
        </div>)}
    </>);
}
//# sourceMappingURL=server-banner.js.map