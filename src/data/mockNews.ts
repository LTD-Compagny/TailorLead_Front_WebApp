export interface NewsItem {
  id: number
  type: 'bodacc' | 'cfnews'
  date: string | null
  category: string
  companies: string | null
  city: string | null
  department: string | null
  activity: string | null
  amount: number | null
  title: string
  details: string
}

export const mockNews: NewsItem[] = [
  {
    id: 1,
    type: 'bodacc',
    date: '2025-11-19',
    category: 'Ventes et cessions',
    companies: 'SCHOUP\'S, BRIGADE 36',
    city: 'Lyon',
    department: 'Rhône',
    activity: 'Restaurant...',
    amount: 150000,
    title: 'Vente et cession - SCHOUP\'S, BRIGADE 36',
    details:
      'Cession de fonds de commerce enregistré à Lyon dans le secteur de la restauration.',
  },
  {
    id: 2,
    type: 'bodacc',
    date: '2025-10-29',
    category: 'Ventes et cessions',
    companies: 'PAPILLE 2, CREPERIE DU PARC',
    city: 'Lyon',
    department: 'Rhône',
    activity: 'Restaurant, bar, crêperie...',
    amount: 115000,
    title: 'Vente et cession - PAPILLE 2, CREPERIE DU PARC',
    details:
      'Cession de fonds de commerce comprenant restaurant, bar et crêperie.',
  },
  {
    id: 3,
    type: 'bodacc',
    date: '2025-10-19',
    category: 'Ventes et cessions',
    companies: 'MERCIERE YG, JG FOOD',
    city: 'Lyon',
    department: 'Rhône',
    activity: 'Restauration traditionnelle chinoise sur place, à emporter...',
    amount: 830000,
    title: 'Vente et cession - MERCIERE YG, JG FOOD',
    details:
      'Cession d\'un fonds de restauration traditionnelle chinoise.',
  },
  {
    id: 4,
    type: 'bodacc',
    date: '2025-10-15',
    category: 'Ventes et cessions',
    companies: 'COBB, LOUMAX',
    city: 'Lyon, Anse',
    department: 'Rhône',
    activity: 'Restauration sur place, café, bar, restaurant, glaces...',
    amount: 125000,
    title: 'Vente et cession - COBB, LOUMAX',
    details:
      'Cession d\'un ensemble de points de restauration et cafés.',
  },
  {
    id: 5,
    type: 'bodacc',
    date: '2025-10-10',
    category: 'Ventes et cessions',
    companies: 'AFGHAN STREET FOOD, AVARELLO, Nicolo',
    city: 'Lyon',
    department: 'Rhône',
    activity: 'Café restaurant pizzéria...',
    amount: 160000,
    title: 'Vente et cession - AFGHAN STREET FOOD, AVARELLO',
    details:
      'Cession d\'un fonds de commerce de restauration rapide et pizzeria.',
  },
  {
    id: 6,
    type: 'bodacc',
    date: '2025-10-10',
    category: 'Ventes et cessions',
    companies: 'ACAL, H3F',
    city: 'Bron, Lyon',
    department: 'Rhône',
    activity: 'Restaurant de type rapide...',
    amount: 180000,
    title: 'Vente et cession - ACAL, H3F',
    details:
      'Cession d\'un fonds de commerce de restauration rapide.',
  },
  {
    id: 7,
    type: 'cfnews',
    date: null,
    category: 'CFNews',
    title: 'CFNews — À venir',
    details: 'Les actualités CFNews seront bientôt disponibles.',
    companies: null,
    city: null,
    department: null,
    activity: null,
    amount: null,
  },
]

