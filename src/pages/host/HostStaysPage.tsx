import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { StaysTable } from '@/components/Host/StaysTable'
import { useAuth } from '@/hooks/useAuth'
import { useServices } from '@/hooks/useServices'
import type { Stay } from '@/types'

export default function HostStaysPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { stayService } = useServices()
  const [stays, setStays] = useState<Stay[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 10

  const loadStays = async () => {
    if (!user?.company) return

    try {
      setLoading(true)
      const result = await stayService.getAllStays({
        companyId: user.company.id,
        page: currentPage,
        size: pageSize,
      })
      setStays(result.content)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading stays:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, user])

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <>
      <title>My Stays</title>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">My Stays</h3>
            <p className="text-sm text-muted-foreground">Manage all your properties and their units.</p>
          </div>
          <Button onClick={() => navigate('/host/stays/new')}>
            <Plus className="mr-2 h-4 w-4" /> New Stay
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <>
            <StaysTable stays={stays} onDelete={loadStays} />

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(i)}
                        isActive={currentPage === i}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </>
  )
}
