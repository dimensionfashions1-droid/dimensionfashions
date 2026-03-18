
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
            // Logic for many pages (simplified for MVP)
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
        <Pagination className="mt-20 border-t border-primary/10 pt-12">
            <PaginationContent className="gap-2">
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) onPageChange(currentPage - 1)
                        }}
                        className={cn(
                            "rounded-none border-primary/20 text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-[10px] font-bold px-6",
                            currentPage === 1 ? "pointer-events-none opacity-30" : "cursor-pointer"
                        )}
                    />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                        {page === '...' ? (
                            <PaginationEllipsis className="text-primary/40" />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onPageChange(page as number)
                                }}
                                className={cn(
                                    "rounded-none w-10 h-10 flex items-center justify-center font-sans text-xs font-bold transition-all",
                                    currentPage === page 
                                        ? "bg-primary text-white border-primary" 
                                        : "border-primary/10 text-text-secondary hover:border-primary/40 hover:text-primary"
                                )}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) onPageChange(currentPage + 1)
                        }}
                        className={cn(
                            "rounded-none border-primary/20 text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-[10px] font-bold px-6",
                            currentPage === totalPages ? "pointer-events-none opacity-30" : "cursor-pointer"
                        )}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
