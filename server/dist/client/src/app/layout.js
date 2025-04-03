"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const navbar_1 = require("@/components/layout/navbar");
const roboto = (0, google_1.Roboto)({
    weight: ['100', '300', '400', '500', '700', '900'],
    subsets: ['latin'],
    variable: '--font-roboto',
    display: 'swap',
});
const jersey = (0, google_1.Jersey_10)({
    weight: ['400'],
    subsets: ['latin'],
    variable: '--font-jersey',
    display: 'swap',
});
exports.metadata = {
    title: 'CS 1.6 Server Tracker',
    description: 'Track Counter-Strike 1.6 servers, monitor player activity, and find the best CS 1.6 servers',
    keywords: 'Counter-Strike 1.6, CS 1.6, servers, gaming, tracker, player stats, server monitoring',
};
function RootLayout({ children }) {
    return (<html lang="en" className={`${roboto.variable} ${jersey.variable}`}>
      <body className="min-h-screen bg-[url('/assets/14.png')] bg-fixed bg-center bg-cover">
        
        <div className="fixed inset-0 bg-black bg-opacity-50 pointer-events-none z-0"/>
        
        
        <navbar_1.default />
        
        
        <main className="mt-4 mb-12 z-10 relative">
          {children}
        </main>
      </body>
    </html>);
}
//# sourceMappingURL=layout.js.map