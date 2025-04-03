interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}
export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps): import("react").JSX.Element;
export {};
