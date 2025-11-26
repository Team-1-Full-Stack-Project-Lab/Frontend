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
    title: 'Vuelos',
    icon: Plane,
    articles: [
      {
        title: 'Reservación de vuelo con crédito de la aerolínea',
        content: 'Cuando cancelas un vuelo, es posible que la aerolínea te ofrezca un crédito. Para canjear tu crédito, visita la sección Créditos en Cuenta y sigue las instrucciones.',
        links: [
          { label: 'Ver mis créditos', url: '#' },
          { label: 'Políticas de cancelación', url: '#' }
        ]
      },
      {
        title: 'Cambios y cancelaciones',
        content: 'La mayoría de los boletos son no reembolsables, pero puedes cancelarlos dentro de las 24 horas posteriores a la compra para obtener un reembolso completo.',
      }
    ]
  },
  {
    id: 'refunds',
    title: 'Reembolsos y cargos',
    icon: CreditCard,
    articles: [
      {
        title: 'Estado de mi reembolso',
        content: 'Los reembolsos pueden tardar hasta 7-10 días hábiles en aparecer en tu estado de cuenta.',
      }
    ]
  },
  {
    id: 'packages',
    title: 'Paquetes',
    icon: Map,
    articles: [
      {
        title: 'Información de paquetes vacacionales',
        content: 'Ahorra reservando vuelo y hotel juntos. Consulta nuestras ofertas de paquetes.',
      }
    ]
  },
  {
    id: 'stays',
    title: 'Hospedaje',
    icon: Building2,
    articles: [
      {
        title: 'Check-in y Check-out',
        content: 'Los horarios estándar son: Check-in 3:00 PM, Check-out 11:00 AM. Consulta tu confirmación para detalles específicos.',
      }
    ]
  },
  {
    id: 'activities',
    title: 'Actividades',
    icon: Ticket,
    articles: [
      {
        title: 'Reservar actividades',
        content: 'Explora y reserva tours, entradas a museos y más experiencias locales.',
      }
    ]
  },
  {
    id: 'cars',
    title: 'Autos',
    icon: Car,
    articles: [
      {
        title: 'Renta de autos',
        content: 'Requisitos: Licencia de conducir válida, tarjeta de crédito a nombre del conductor principal.',
      }
    ]
  },
  {
    id: 'account',
    title: 'Cuentas',
    icon: UserCircle,
    articles: [
      {
        title: 'Gestionar mi cuenta',
        content: 'Actualiza tu perfil, cambia tu contraseña y gestiona tus preferencias de comunicación.',
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacidad',
    icon: ShieldCheck,
    articles: [
      {
        title: 'Política de privacidad',
        content: 'Nos tomamos muy en serio tu privacidad. Lee cómo protegemos tus datos.',
      }
    ]
  },
  {
    id: 'security',
    title: 'Seguridad',
    icon: ShieldCheck,
    articles: [
      {
        title: 'Consejos de seguridad',
        content: 'Mantén tu cuenta segura activando la autenticación de dos factores.',
      }
    ]
  },
  {
    id: 'rewards',
    title: 'Programa de lealtad',
    icon: Gift,
    articles: [
      {
        title: 'Beneficios del programa',
        content: 'Gana puntos por cada viaje y canjéalos por descuentos en futuras reservas.',
      }
    ]
  },
  {
    id: 'alerts',
    title: 'Alertas de viaje',
    icon: AlertTriangle,
    articles: [
      {
        title: 'Avisos importantes',
        content: 'Mantente informado sobre restricciones de viaje, requisitos de visa y alertas sanitarias.',
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
          <h1 className="text-3xl font-bold tracking-tight">Centro de ayuda</h1>
          <p className="text-xl font-medium text-muted-foreground">
            Hola, {user?.firstName || 'Viajero'}
          </p>
          
          <HelpSearchBar onSearch={handleSearch} />
        </div>

        {/* Categories Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Consulta artículos de ayuda</h2>
          
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
