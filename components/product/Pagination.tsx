import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function ProductPagination({ currentPage, totalPages, onPageChange }: ProductPaginationProps) {
    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = []
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
            }
        }
        return pages
    }

    if (totalPages <= 1) return null

    return (
        <Pagination className="mt-20 pt-12 border-t border-gray-100">
            <PaginationContent className="gap-3">
                <PaginationItem>
                    <button
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={cn(
                            "group flex items-center justify-center w-10 h-10 rounded-full border border-gray-100 transition-all duration-300",
                            currentPage === 1 
                                ? "opacity-20 cursor-not-allowed" 
                                : "hover:border-primary hover:bg-primary hover:text-white"
                        )}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    </button>
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                        {page === '...' ? (
                            <PaginationEllipsis className="text-primary/20" />
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all duration-300 border",
                                    currentPage === page 
                                        ? "bg-primary text-white border-primary shadow-lg shadow-black/10 scale-110" 
                                        : "border-transparent text-primary/40 hover:text-primary hover:border-gray-100"
                                )}
                            >
                                {page}
                            </button>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <button
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={cn(
                            "group flex items-center justify-center w-10 h-10 rounded-full border border-gray-100 transition-all duration-300",
                            currentPage === totalPages 
                                ? "opacity-20 cursor-not-allowed" 
                                : "hover:border-primary hover:bg-primary hover:text-white"
                        )}
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
