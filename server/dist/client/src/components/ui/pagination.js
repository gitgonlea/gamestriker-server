'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Pagination;
function Pagination({ totalPages, currentPage, onPageChange }) {
    if (totalPages <= 1) {
        return null;
    }
    const renderPageButtons = () => {
        const buttons = [];
        if (currentPage > 3 && currentPage !== 2) {
            buttons.push(<button key="first" onClick={() => onPageChange(1)} className="px-2 py-1 mr-1 text-xs font-bold bg-sky-500 text-white hover:bg-amber-400 transition-colors">
          1
        </button>);
        }
        if (currentPage > 4) {
            buttons.push(<span key="ellipsis-start" className="px-1">...</span>);
        }
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage ||
                i === currentPage - 1 ||
                i === currentPage + 1 ||
                i === currentPage - 2 ||
                i === currentPage + 2) {
                buttons.push(<button key={i} onClick={() => onPageChange(i)} className={`px-2 py-1 mr-1 text-xs font-bold ${i === currentPage
                        ? 'bg-amber-400 text-black'
                        : 'bg-sky-500 text-white hover:bg-sky-600'} transition-colors`}>
            {i}
          </button>);
            }
        }
        if (currentPage < totalPages - 3) {
            buttons.push(<span key="ellipsis-end" className="px-1">...</span>);
        }
        if (currentPage < totalPages - 1 && currentPage < totalPages - 2 && totalPages > 4) {
            buttons.push(<button key="last" onClick={() => onPageChange(totalPages)} className="px-2 py-1 mr-1 text-xs font-bold bg-sky-500 text-white hover:bg-amber-400 transition-colors">
          {totalPages}
        </button>);
        }
        return buttons;
    };
    return (<div className="flex justify-center items-center mb-4">
      {renderPageButtons()}
    </div>);
}
//# sourceMappingURL=pagination.js.map