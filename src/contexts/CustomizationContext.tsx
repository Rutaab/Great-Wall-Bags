import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

export type ExteriorMaterial = 'full-grain' | 'top-grain' | 'saffiano' | 'suede' | 'canvas' | 'vegan-leather'
export type HardwareFinish = 'gold' | 'silver' | 'matte-black' | 'brass' | 'rose-gold'
export type StrapType = 'standard' | 'crossbody' | 'chain' | 'woven' | 'detachable'
export type InteriorLayout = 'standard' | 'tech-sleeve' | 'organizer' | 'minimal'

export interface CustomizationState {
  exteriorColor: string
  exteriorMaterial: ExteriorMaterial
  hardwareFinish: HardwareFinish
  interiorColor: string
  interiorLayout: InteriorLayout
  strapType: StrapType
  monogramText: string
  monogramFont: 'serif' | 'sans' | 'cursive'
  addons: string[]
  bagShape: 'tote' | 'crossbody' | 'backpack' | 'clutch'
}

interface CustomizationContextType {
  state: CustomizationState
  setExteriorColor: (color: string) => void
  setExteriorMaterial: (mat: ExteriorMaterial) => void
  setHardwareFinish: (finish: HardwareFinish) => void
  setInteriorColor: (color: string) => void
  setInteriorLayout: (layout: InteriorLayout) => void
  setStrapType: (strap: StrapType) => void
  setMonogramText: (text: string) => void
  setMonogramFont: (font: 'serif' | 'sans' | 'cursive') => void
  toggleAddon: (addon: string) => void
  setBagShape: (shape: 'tote' | 'crossbody' | 'backpack' | 'clutch') => void
  resetDesign: () => void
  estimatedPrice: number
  savedDesigns: CustomizationState[]
  saveDesign: () => void
  loadDesign: (index: number) => void
  deleteDesign: (index: number) => void
}

const initialState: CustomizationState = {
  exteriorColor: '#8B4513',
  exteriorMaterial: 'full-grain',
  hardwareFinish: 'gold',
  interiorColor: '#D2B48C',
  interiorLayout: 'standard',
  strapType: 'standard',
  monogramText: '',
  monogramFont: 'serif',
  addons: [],
  bagShape: 'tote',
}

const STORAGE_KEY = 'hobags_saved_designs'

const loadSavedDesigns = (): CustomizationState[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined)

export const useCustomization = () => {
  const ctx = useContext(CustomizationContext)
  if (!ctx) throw new Error('useCustomization must be used within CustomizationProvider')
  return ctx
}

const materialPriceMap: Record<ExteriorMaterial, number> = {
  'full-grain': 120, 'top-grain': 80, 'saffiano': 100,
  'suede': 90, 'canvas': 40, 'vegan-leather': 50,
}

const hardwarePriceMap: Record<HardwareFinish, number> = {
  'gold': 30, 'silver': 20, 'matte-black': 25, 'brass': 35, 'rose-gold': 40,
}

const strapPriceMap: Record<StrapType, number> = {
  'standard': 0, 'crossbody': 15, 'chain': 45, 'woven': 30, 'detachable': 25,
}

const basePriceMap: Record<string, number> = {
  tote: 350, crossbody: 280, backpack: 420, clutch: 200,
}

export const CustomizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CustomizationState>(initialState)
  const [savedDesigns, setSavedDesigns] = useState<CustomizationState[]>(loadSavedDesigns)

  const setExteriorColor = useCallback((color: string) => setState(prev => ({ ...prev, exteriorColor: color })), [])
  const setExteriorMaterial = useCallback((mat: ExteriorMaterial) => setState(prev => ({ ...prev, exteriorMaterial: mat })), [])
  const setHardwareFinish = useCallback((finish: HardwareFinish) => setState(prev => ({ ...prev, hardwareFinish: finish })), [])
  const setInteriorColor = useCallback((color: string) => setState(prev => ({ ...prev, interiorColor: color })), [])
  const setInteriorLayout = useCallback((layout: InteriorLayout) => setState(prev => ({ ...prev, interiorLayout: layout })), [])
  const setStrapType = useCallback((strap: StrapType) => setState(prev => ({ ...prev, strapType: strap })), [])
  const setMonogramText = useCallback((text: string) => setState(prev => ({ ...prev, monogramText: text.slice(0, 3) })), [])
  const setMonogramFont = useCallback((font: 'serif' | 'sans' | 'cursive') => setState(prev => ({ ...prev, monogramFont: font })), [])
  const setBagShape = useCallback((shape: 'tote' | 'crossbody' | 'backpack' | 'clutch') => setState(prev => ({ ...prev, bagShape: shape })), [])
  const toggleAddon = useCallback((addon: string) => setState(prev => ({
    ...prev,
    addons: prev.addons.includes(addon) ? prev.addons.filter(a => a !== addon) : [...prev.addons, addon],
  })), [])
  const resetDesign = useCallback(() => setState(initialState), [])

  const estimatedPrice = basePriceMap[state.bagShape] + materialPriceMap[state.exteriorMaterial] + hardwarePriceMap[state.hardwareFinish] + strapPriceMap[state.strapType] + state.addons.length * 15

  const saveDesign = useCallback(() => {
    const designs = [...loadSavedDesigns(), { ...state }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
    setSavedDesigns(designs)
  }, [state])

  const loadDesign = useCallback((index: number) => {
    const designs = loadSavedDesigns()
    if (designs[index]) setState(designs[index])
  }, [])

  const deleteDesign = useCallback((index: number) => {
    const designs = loadSavedDesigns()
    designs.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
    setSavedDesigns(designs)
  }, [])

  return (
    <CustomizationContext.Provider value={{
      state, setExteriorColor, setExteriorMaterial, setHardwareFinish,
      setInteriorColor, setInteriorLayout, setStrapType, setMonogramText,
      setMonogramFont, toggleAddon, setBagShape, resetDesign, estimatedPrice,
      savedDesigns, saveDesign, loadDesign, deleteDesign,
    }}>
      {children}
    </CustomizationContext.Provider>
  )
}
