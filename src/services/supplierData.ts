import { api } from './api'

const PREFIX = 'hobags_supplier_'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save<T>(key: string, data: T): void {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(data)) } catch {}
}

export interface DashboardKpi {
  label: string; value: string; change: string; icon: string; color: string
}

export interface WarehouseStat {
  name: string; capacity: number; status: string; color: string
}

export interface SupplyShipment {
  product: string; sku: string; qty: number; status: string; eta: string; statusColor: string
}

export interface TopBoutique {
  name: string; revenue: string; products: number; growth: string; bar: number
}

const defaultKpis: DashboardKpi[] = [
  { label: 'Total Listings', value: '342', change: '+18', icon: 'inventory_2', color: '#004be3' },
  { label: 'Active Boutiques', value: '8', change: '+2', icon: 'store', color: '#9e3c00' },
  { label: 'Warehouse Fill Rate', value: '94%', change: '+5%', icon: 'warehouse', color: '#004be3' },
  { label: 'Avg. Fulfillment Time', value: '1.8d', change: '-0.4d', icon: 'timer', color: '#b9002c' },
]

const defaultWarehouses: WarehouseStat[] = [
  { name: 'East Coast Hub', capacity: 78, status: 'Optimal', color: 'bg-[#004be3]' },
  { name: 'West Coast DC', capacity: 92, status: 'Near Capacity', color: 'bg-[#ff7936]' },
  { name: 'Central Fulfillment', capacity: 45, status: 'Ample Space', color: 'bg-[#004be3]' },
  { name: 'International Gateway', capacity: 63, status: 'Stable', color: 'bg-[#9e3c00]' },
]

const defaultShipments: SupplyShipment[] = [
  { product: 'Premium Canvas Tote', sku: 'PCT-001', qty: 500, status: 'In Transit', eta: 'Jun 24', statusColor: 'text-[#004be3] bg-[#004be3]/10' },
  { product: 'Organic Cotton Backpack', sku: 'OCB-022', qty: 1200, status: 'Processing', eta: 'Jun 28', statusColor: 'text-[#ff7936] bg-[#ff7936]/10' },
  { product: 'Recycled Polyester Duffel', sku: 'RPD-047', qty: 800, status: 'Delivered', eta: 'Jun 20', statusColor: 'text-green-700 bg-green-100' },
  { product: 'Bamboo Fiber Crossbody', sku: 'BFC-113', qty: 350, status: 'Pending', eta: 'Jul 2', statusColor: 'text-[#805030] bg-[#ffede4]' },
]

const defaultBoutiques: TopBoutique[] = [
  { name: 'Heritage Leather Co.', revenue: '$128.4k', products: 45, growth: '+32%', bar: 100 },
  { name: 'Urban Nomad Crafts', revenue: '$94.2k', products: 28, growth: '+24%', bar: 76 },
  { name: 'EcoWeave Bags', revenue: '$67.8k', products: 36, growth: '+18%', bar: 55 },
  { name: 'Precision Travel Gear', revenue: '$52.1k', products: 19, growth: '+11%', bar: 42 },
]

export function loadDashboardKpis(): DashboardKpi[] {
  return load('kpis', defaultKpis)
}

export function saveDashboardKpis(data: DashboardKpi[]): void {
  save('kpis', data)
}

export function loadWarehouseStats(): WarehouseStat[] {
  return load('warehouses', defaultWarehouses)
}

export function saveWarehouseStats(data: WarehouseStat[]): void {
  save('warehouses', data)
}

export function loadSupplyShipments(): SupplyShipment[] {
  return load('shipments', defaultShipments)
}

export function saveSupplyShipments(data: SupplyShipment[]): void {
  save('shipments', data)
}

export function loadTopBoutiques(): TopBoutique[] {
  return load('boutiques', defaultBoutiques)
}

export function saveTopBoutiques(data: TopBoutique[]): void {
  save('boutiques', data)
}

export function tryFetchDashboard(): Promise<{
  kpis: DashboardKpi[]; warehouses: WarehouseStat[]; shipments: SupplyShipment[]; boutiques: TopBoutique[]
} | null> {
  return api.getSupplierDashboard().then((data: any) => {
    if (!data) return null
    const mapped = {
      kpis: data.kpis || defaultKpis,
      warehouses: data.warehouses || defaultWarehouses,
      shipments: data.shipments || defaultShipments,
      boutiques: data.boutiques || defaultBoutiques,
    }
    saveDashboardKpis(mapped.kpis)
    saveWarehouseStats(mapped.warehouses)
    saveSupplyShipments(mapped.shipments)
    saveTopBoutiques(mapped.boutiques)
    return mapped
  }).catch(() => null)
}

export function resetDashboardData(): void {
  localStorage.removeItem(PREFIX + 'kpis')
  localStorage.removeItem(PREFIX + 'warehouses')
  localStorage.removeItem(PREFIX + 'shipments')
  localStorage.removeItem(PREFIX + 'boutiques')
}
