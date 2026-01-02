import { useState } from 'react'
import { 
  Plane, 
  CreditCard, 
  Building2, 
  Ticket, 
  UserCircle, 
  ShieldCheck, 
  Gift, 
  AlertTriangle,
  Car,
  Map
} from 'lucide-react'
import { HelpSearchBar } from '@/components/HelpCenter/HelpSearchBar'
import { HelpCategoryCard } from '@/components/HelpCenter/HelpCategoryCard'
import { HelpArticleView } from '@/components/HelpCenter/HelpArticleView'
import { HelpSearchModal } from '@/components/HelpCenter/HelpSearchModal'
import { useAuth } from '@/hooks/useAuth'

const HELP_CATEGORIES = [
  {
    id: 'flights',
    title: 'Flights',
    icon: Plane,
    articles: [
      {
        title: 'Flight reservation with airline credit',
        content: 'When you cancel a flight, the airline might offer you a credit. To redeem your credit, visit the Account Credits section and follow the instructions.',
        links: [
          { label: 'View my credits', url: '#' },
          { label: 'Cancellation policies', url: '#' }
        ]
      },
      {
        title: 'Changes and cancellations',
        content: 'Most tickets are non-refundable, but you can cancel them within 24 hours of purchase for a full refund.',
      }
    ]
  },
  {
    id: 'refunds',
    title: 'Refunds and charges',
    icon: CreditCard,
    articles: [
      {
        title: 'My refund status',
        content: 'Refunds may take up to 7-10 business days to appear on your account statement.',
      }
    ]
  },
  {
    id: 'packages',
    title: 'Packages',
    icon: Map,
    articles: [
      {
        title: 'Vacation package information',
        content: 'Save by booking flight and hotel together. Check our package deals.',
      }
    ]
  },
  {
    id: 'stays',
    title: 'Stays',
    icon: Building2,
    articles: [
      {
        title: 'Check-in and Check-out',
        content: 'Standard times are: Check-in 3:00 PM, Check-out 11:00 AM. Check your confirmation for specific details.',
      }
    ]
  },
  {
    id: 'activities',
    title: 'Activities',
    icon: Ticket,
    articles: [
      {
        title: 'Book activities',
        content: 'Explore and book tours, museum tickets, and more local experiences.',
      }
    ]
  },
  {
    id: 'cars',
    title: 'Cars',
    icon: Car,
    articles: [
      {
        title: 'Car rental',
        content: 'Requirements: Valid driver\'s license, credit card in the main driver\'s name.',
      }
    ]
  },
  {
    id: 'account',
    title: 'Accounts',
    icon: UserCircle,
    articles: [
      {
        title: 'Manage my account',
        content: 'Update your profile, change your password, and manage your communication preferences.',
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy',
    icon: ShieldCheck,
    articles: [
      {
        title: 'Privacy policy',
        content: 'We take your privacy very seriously. Read how we protect your data.',
      }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    icon: ShieldCheck,
    articles: [
      {
        title: 'Security tips',
        content: 'Keep your account safe by enabling two-factor authentication.',
      }
    ]
  },
  {
    id: 'rewards',
    title: 'Loyalty program',
    icon: Gift,
    articles: [
      {
        title: 'Program benefits',
        content: 'Earn points for every trip and redeem them for discounts on future bookings.',
      }
    ]
  },
  {
    id: 'alerts',
    title: 'Travel alerts',
    icon: AlertTriangle,
    articles: [
      {
        title: 'Important notices',
        content: 'Stay informed about travel restrictions, visa requirements, and health alerts.',
      }
    ]
  }
]

export default function HelpCenterPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<typeof HELP_CATEGORIES[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ title: string; categoryTitle: string; categoryId: string }[]>([])
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const handleSearch = (query: string) => {
    const results: { title: string; categoryTitle: string; categoryId: string }[] = []
    const lowerQuery = query.toLowerCase()

    HELP_CATEGORIES.forEach(category => {
      // Search in category title
      if (category.title.toLowerCase().includes(lowerQuery)) {
        category.articles.forEach(article => {
          results.push({
            title: article.title,
            categoryTitle: category.title,
            categoryId: category.id
          })
        })
      } else {
        // Search in articles
        category.articles.forEach(article => {
          if (article.title.toLowerCase().includes(lowerQuery) || article.content?.toLowerCase().includes(lowerQuery)) {
            results.push({
              title: article.title,
              categoryTitle: category.title,
              categoryId: category.id
            })
          }
        })
      }
    })

    setSearchQuery(query)
    setSearchResults(results)
    setIsSearchModalOpen(true)
  }

  const handleResultClick = (result: { categoryId: string }) => {
    const category = HELP_CATEGORIES.find(c => c.id === result.categoryId)
    if (category) {
      setSelectedCategory(category)
      setIsSearchModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-xl font-medium text-muted-foreground">
            Hello, {user?.firstName || 'Traveler'}
          </p>
          
          <HelpSearchBar onSearch={handleSearch} />
        </div>

        {/* Categories Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Browse help articles</h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HELP_CATEGORIES.map((category) => (
              <HelpCategoryCard
                key={category.id}
                icon={category.icon}
                title={category.title}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Article View Side Panel */}
      <HelpArticleView
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        category={selectedCategory}
      />

      <HelpSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        query={searchQuery}
        results={searchResults}
        onResultClick={handleResultClick}
      />
    </div>
  )
}
