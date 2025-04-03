'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
const navigation_1 = require("next/navigation");
const link_1 = require("next/link");
const image_1 = require("next/image");
const react_1 = require("react");
const useTranslation_1 = require("@/lib/hooks/useTranslation");
const react_icons_1 = require("@radix-ui/react-icons");
function Navbar() {
    const pathname = (0, navigation_1.usePathname)();
    const router = (0, navigation_1.useRouter)();
    const { t, locale } = (0, useTranslation_1.useTranslation)();
    const [isMenuOpen, setIsMenuOpen] = (0, react_1.useState)(false);
    const handleReload = () => {
        if (pathname === '/') {
            window.location.reload();
        }
        else {
            router.push('/');
        }
    };
    return (<div className="flex flex-col items-center w-full">
      <div className="flex justify-between items-end w-4/5 mb-1 pb-4 relative z-10">
        <div className="cursor-pointer" onClick={handleReload}>
          <div className="font-jersey text-3xl uppercase transition-colors hover:text-amber-400 mb-1">
            {locale === 'en' ? 'GameStriker' : 'Argentina Strike'}
          </div>
        </div>
        
        <div className="text-sm font-semibold mb-1 hidden md:block">
          {locale === 'en' ? (<>
              100% secure servers.<br />
              No viruses, destroy or fuckoff.<br />
              No Russian or Chinese bots.<br />
            </>) : (<>
              Servidores 100% argentinos y seguros.<br />
              Servidores sin virus, destroy, fuckoff.<br />
              Servidores sin bots rusos, chinos, etc.<br />
            </>)}
        </div>
        
        <div className="relative">
          <image_1.default src="/assets/argflag2.webp" alt="Argentina Flag" width={120} height={80} className="rounded"/>
        </div>
      </div>
      
      <nav className="relative flex justify-between items-center h-10 bg-sky-500 shadow-md rounded opacity-90 w-4/5 z-10">
        <div className="flex pl-2 text-shadow">
          <NavItem href="/" icon={<react_icons_1.GamepadIcon className="mr-2"/>} text={t('servers')}/>
          
          <div className="nav-section"></div>
          <div className="nav-section"></div>
          
          <NavItem href="/agregarservidor" icon={<react_icons_1.PlusIcon className="mr-2"/>} text={t('addServer')}/>
          
          <NavItem href="https://discord.gg/SwAp2cUuVU" icon={<react_icons_1.DiscordLogoIcon className="mr-2"/>} text="Discord" external/>
          
          <div className="nav-section"></div>
        </div>
        
        
        <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </nav>
      
      
      {isMenuOpen && (<div className="md:hidden w-4/5 bg-sky-500 shadow-md rounded opacity-90 overflow-hidden transition-all duration-300 z-20">
          <div className="flex flex-col">
            <MobileNavItem href="/" icon={<react_icons_1.GamepadIcon className="mr-2"/>} text={t('servers')} onClick={() => setIsMenuOpen(false)}/>
            
            <MobileNavItem href="/agregarservidor" icon={<react_icons_1.PlusIcon className="mr-2"/>} text={t('addServer')} onClick={() => setIsMenuOpen(false)}/>
            
            <MobileNavItem href="https://discord.gg/SwAp2cUuVU" icon={<react_icons_1.DiscordLogoIcon className="mr-2"/>} text="Discord" external onClick={() => setIsMenuOpen(false)}/>
          </div>
        </div>)}
    </div>);
}
function NavItem({ href, icon, text, external = false }) {
    return external ? (<a href={href} target="_blank" rel="noopener noreferrer" className="group relative flex items-center px-4 py-2 text-white cursor-pointer">
      {icon}
      <span className="nav-text font-medium absolute top-1/2 transform -translate-y-1/2 z-20 hidden md:inline">
        {text}
      </span>
      
      <div className="absolute inset-0 -top-[55%] h-10 bg-sky-400 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
    </a>) : (<link_1.default href={href} className="group relative flex items-center px-4 py-2 text-white cursor-pointer">
      {icon}
      <span className="nav-text font-medium absolute top-1/2 transform -translate-y-1/2 z-20 hidden md:inline">
        {text}
      </span>
      
      <div className="absolute inset-0 -top-[55%] h-10 bg-sky-400 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
    </link_1.default>);
}
function MobileNavItem({ href, icon, text, external = false, onClick }) {
    return external ? (<a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-3 text-white hover:bg-sky-600" onClick={onClick}>
      {icon}
      <span>{text}</span>
    </a>) : (<link_1.default href={href} className="flex items-center px-4 py-3 text-white hover:bg-sky-600" onClick={onClick}>
      {icon}
      <span>{text}</span>
    </link_1.default>);
}
//# sourceMappingURL=navbar.js.map