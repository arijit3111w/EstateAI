"use client"

import { useState, useMemo } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, Home, DollarSign, BarChart3, PieChart, LinkIcon as LineIcon, Target, Percent } from "lucide-react"
import analyticsBackground from "@/assets/analytics-bg.jpg"
import { usePrediction } from "@/contexts/PredictionContext"
import { useLanguage } from "@/contexts/LanguageContext"
import PropertyComparisonComponent from "@/components/PropertyComparison"

// Charts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"

const Analytics = () => {
  const { t } = useLanguage()
  const { prediction, relatedHouses, hasPredictionData } = usePrediction()
  const [purchasePrice, setPurchasePrice] = useState(1000000)
  const [loanAmount, setLoanAmount] = useState(800000)
  const [interestRate, setInterestRate] = useState(7.5)
  const [loanTenure, setLoanTenure] = useState(20)
  const [monthlyRent, setMonthlyRent] = useState(15000)
  const [appreciation, setAppreciation] = useState(8)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)

  // Update form values when a property is selected
  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property)
    setPurchasePrice(property.price)
    setLoanAmount(Math.round(property.price * 0.8)) // 80% loan
    
    // Estimate monthly rent based on property value, location, and area
    // Use a more sophisticated rental estimation
    const baseRentPercent = 0.004 // 0.4% of property value per month as base
    const areaMultiplier = Math.min(property.living_area / 1000, 3) // Size factor (capped at 3x)
    const gradeMultiplier = Math.max(property.grade / 7, 0.8) // Quality factor
    
    const estimatedMonthlyRent = Math.round(
      (property.price * baseRentPercent * areaMultiplier * gradeMultiplier) / 100
    ) * 100 // Round to nearest 100
    
    setMonthlyRent(Math.max(estimatedMonthlyRent, 1000)) // Minimum $1000 rent
  }

  const calculateEMI = () => {
    const principal = loanAmount
    const rate = interestRate / 12 / 100
    const tenure = loanTenure * 12
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1)
    return emi
  }

  const calculateROI = () => {
    const years = 10
    const futureValue = purchasePrice * Math.pow(1 + appreciation / 100, years)
    const totalInvestment = purchasePrice - loanAmount
    
    // Prevent division by zero and negative investment
    if (totalInvestment <= 0) {
      return 0
    }
    
    const roi = ((futureValue - purchasePrice) / totalInvestment) * 100
    return Math.max(0, roi) // Ensure ROI is not negative
  }

  const calculateRentalYield = () => {
    const annualRent = monthlyRent * 12
    const yield_percent = (annualRent / purchasePrice) * 100
    return yield_percent
  }

  const emi = calculateEMI()
  const roi = calculateROI()
  const rentalYield = calculateRentalYield()
  const totalInterest = emi * loanTenure * 12 - loanAmount

  const projectionData = useMemo(() => {
    const years = Array.from({ length: 11 }, (_, i) => i)
    return years.map((y) => {
      const value = purchasePrice * Math.pow(1 + appreciation / 100, y)
      return { year: `Y${y}`, value, valueL: value / 100000 }
    })
  }, [purchasePrice, appreciation])

  const emiPieData = useMemo(
    () => [
      { name: "Principal", value: loanAmount },
      { name: "Interest", value: totalInterest > 0 ? totalInterest : 0 },
    ],
    [loanAmount, totalInterest],
  )

  const rentalBars = useMemo(
    () => [
      { label: "Annual Income", value: monthlyRent * 12 },
      { label: "10-Year Income", value: monthlyRent * 12 * 10 },
    ],
    [monthlyRent],
  )

  const PIE_COLORS = ["oklch(var(--color-chart-2))", "oklch(var(--color-chart-1))"]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="h-64 md:h-72 lg:h-80">
            <img
              src={analyticsBackground}
              alt="Financial analytics background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-700/60" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="text-center text-white max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                  {t('analytics.investmentDashboard')}
                </h1>
                <p className="mt-2 text-base md:text-lg text-white/90 text-pretty">
                  {t('analytics.dashboardSubtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Strip */}
        <section className="container mx-auto px-4 -mt-8 md:-mt-10 lg:-mt-12 relative z-10">
          {selectedProperty && (
            <div className="mb-4 p-4 bg-blue-600 text-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{t('analytics.currentlyAnalyzing')}</h4>
                  <p className="text-blue-100 text-sm">
                    {t('analytics.propertyNumber')} #{relatedHouses.findIndex(h => h.id === selectedProperty.id) + 1} • 
                    {selectedProperty.bedrooms}BR/{selectedProperty.bathrooms}BA • 
                    {selectedProperty.living_area.toLocaleString()} {t('analytics.sqft')} • 
                    {t('analytics.grade')} {selectedProperty.grade}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${(selectedProperty.price / 1000).toFixed(0)}K CAD</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedProperty(null)}
                    className="mt-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    {t('analytics.clearSelection')}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('analytics.roiProjection')}</span>
                <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
              </div>
              <div className="mt-1 text-2xl font-semibold">{roi.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">{t('analytics.projectionBased')}</div>
            </Card>
            <Card className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('analytics.rentalYield')}</span>
                <Home className="h-4 w-4 text-chart-2" aria-hidden="true" />
              </div>
              <div className="mt-1 text-2xl font-semibold">{rentalYield.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">{t('analytics.annualRentVs')}</div>
            </Card>
            <Card className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('analytics.monthlyEmi')}</span>
                <DollarSign className="h-4 w-4 text-chart-5" aria-hidden="true" />
              </div>
              <div className="mt-1 text-2xl font-semibold">${emi.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">{t('analytics.basedOnRateAndTenure')}</div>
            </Card>
            <Card className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('analytics.totalInterest')}</span>
                <PieChart className="h-4 w-4 text-chart-1" aria-hidden="true" />
              </div>
              <div className="mt-1 text-2xl font-semibold">${(totalInterest / 100000).toFixed(2)}L</div>
              <div className="text-xs text-muted-foreground">{t('analytics.overFullLoanTenure')}</div>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <Tabs defaultValue="roi" className="space-y-6 md:space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="roi" className="flex items-center gap-2">
                <LineIcon className="h-4 w-4" /> {t('analytics.roi')}
              </TabsTrigger>
              <TabsTrigger value="rental" className="flex items-center gap-2">
                <Home className="h-4 w-4" /> {t('analytics.rental')}
              </TabsTrigger>
              <TabsTrigger value="emi" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" /> {t('analytics.emi')}
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> {t('analytics.compare')}
              </TabsTrigger>
            </TabsList>

            {/* ROI Calculator */}
            <TabsContent value="roi">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                          <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold">{t('analytics.investmentCalculator')}</h3>
                          <p className="text-sm text-muted-foreground">{t('analytics.configureInvestmentParameters')}</p>
                        </div>
                      </div>
                      {selectedProperty && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          Property #{relatedHouses.findIndex(h => h.id === selectedProperty.id) + 1}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Purchase Price Section */}
                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Home className="h-4 w-4 text-green-600" />
                        <Label htmlFor="price" className="font-medium text-green-700 dark:text-green-400">Property Value</Label>
                      </div>
                      <Input
                        id="price"
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                        inputMode="numeric"
                        className="text-lg font-semibold h-12"
                        placeholder="Enter purchase price"
                        aria-label="Purchase Price in Rupees"
                      />
                      <div className="mt-2 text-sm text-muted-foreground">
                        ${(purchasePrice / 100000).toFixed(2)} Lakhs
                      </div>
                    </div>

                    {/* Loan Details Section */}
                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4 text-orange-600" />
                        <Label htmlFor="loan" className="font-medium text-orange-700 dark:text-orange-400">Loan Amount</Label>
                      </div>
                      <Input
                        id="loan"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        inputMode="numeric"
                        className="text-lg font-semibold h-12"
                        placeholder="Enter loan amount"
                        aria-label="Loan Amount in Rupees"
                      />
                      <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                        <span>${(loanAmount / 100000).toFixed(2)} Lakhs</span>
                        <span>{((loanAmount / purchasePrice) * 100).toFixed(1)}% of property value</span>
                      </div>
                    </div>

                    {/* Appreciation Section */}
                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <Label htmlFor="appreciation" className="font-medium text-purple-700 dark:text-purple-400">Annual Appreciation</Label>
                      </div>
                      <Input
                        id="appreciation"
                        type="number"
                        value={appreciation}
                        onChange={(e) => setAppreciation(Number(e.target.value))}
                        step="0.1"
                        className="text-lg font-semibold h-12"
                        placeholder="Enter appreciation rate"
                        aria-label="Expected Appreciation percentage per year"
                      />
                      <div className="mt-2 text-sm text-muted-foreground">
                        {appreciation}% per year growth expectation
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div className="text-xs text-green-600 dark:text-green-400">Down Payment</div>
                        <div className="font-semibold text-green-700 dark:text-green-300">
                          ${((purchasePrice - loanAmount) / 100000).toFixed(1)}L
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <div className="text-xs text-blue-600 dark:text-blue-400">LTV Ratio</div>
                        <div className="font-semibold text-blue-700 dark:text-blue-300">
                          {((loanAmount / purchasePrice) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl border-0 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">10-Year Investment Projection</h3>
                        <p className="text-sm text-blue-100">Future value growth based on appreciation</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-200" />
                          <div className="text-xs text-blue-200">Total Investment</div>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          ${((purchasePrice - loanAmount) / 100000).toFixed(2)}L
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Percent className="h-4 w-4 text-green-200" />
                          <div className="text-xs text-blue-200">Expected ROI</div>
                        </div>
                        <div className="text-2xl font-bold text-green-300">{roi.toFixed(1)}%</div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Home className="h-4 w-4 text-blue-200" />
                          <div className="text-xs text-blue-200">Future Value</div>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          ${(projectionData[projectionData.length - 1].value / 100000).toFixed(2)}L
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-green-200" />
                          <div className="text-xs text-blue-200">Total Profit</div>
                        </div>
                        <div className="text-2xl font-bold text-green-300">
                          ${((projectionData[projectionData.length - 1].value - purchasePrice) / 100000).toFixed(2)}L
                        </div>
                      </div>
                    </div>

                    <div className="h-48 rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectionData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                          <XAxis dataKey="year" stroke="rgba(255,255,255,0.8)" fontSize={12} />
                          <YAxis
                            stroke="rgba(255,255,255,0.8)"
                            tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                            fontSize={12}
                          />
                          <RechartsTooltip
                            contentStyle={{
                              background: "rgba(255,255,255,0.95)",
                              border: "1px solid rgba(0,0,0,0.1)",
                              color: "#1f2937",
                              borderRadius: "8px"
                            }}
                            formatter={(v: number) => [`$${(v / 100000).toFixed(2)}L`, "Value"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                            name="Future Value"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Rental Income Analyzer */}
            <TabsContent value="rental">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900 dark:to-green-800">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                          <Home className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold">Rental Income Calculator</h3>
                          <p className="text-sm text-muted-foreground">Estimate your rental returns</p>
                        </div>
                      </div>
                      {selectedProperty && (
                        <Badge className="bg-green-600 text-white text-xs">
                          Property #{relatedHouses.findIndex(h => h.id === selectedProperty.id) + 1}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Monthly Rent Section */}
                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <Label htmlFor="rent" className="font-medium text-green-700 dark:text-green-400">Expected Monthly Rent</Label>
                      </div>
                      <Input
                        id="rent"
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        inputMode="numeric"
                        className="text-lg font-semibold h-12"
                        placeholder="Enter monthly rent"
                        aria-label="Expected Monthly Rent in Rupees"
                      />
                      <div className="mt-2 text-sm text-muted-foreground">
                        ${(monthlyRent / 1000).toFixed(0)}K per month
                      </div>
                    </div>

                    {/* Property Value Display */}
                    <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Home className="h-4 w-4 text-blue-600" />
                        <Label className="font-medium text-blue-700 dark:text-blue-400">Property Value</Label>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${(purchasePrice / 100000).toFixed(2)} Lakhs
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Current market valuation
                      </div>
                    </div>

                    {/* Rental Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Annual Income</div>
                        <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                          ${((monthlyRent * 12) / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-center">
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Rental Yield</div>
                        <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                          {rentalYield.toFixed(2)}%
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center col-span-2">
                        <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">10-Year Total Income</div>
                        <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                          ${((monthlyRent * 12 * 10) / 100000).toFixed(2)} Lakhs
                        </div>
                      </div>
                    </div>

                    {/* Yield Assessment */}
                    <div className={`p-3 rounded-lg text-center ${
                      rentalYield >= 4 
                        ? "bg-green-100 dark:bg-green-900/30" 
                        : rentalYield >= 3 
                        ? "bg-yellow-100 dark:bg-yellow-900/30" 
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      <div className={`text-sm font-medium ${
                        rentalYield >= 4 
                          ? "text-green-700 dark:text-green-300" 
                          : rentalYield >= 3 
                          ? "text-yellow-700 dark:text-yellow-300" 
                          : "text-red-700 dark:text-red-300"
                      }`}>
                        Investment Grade: {rentalYield >= 4 ? "Excellent" : rentalYield >= 3 ? "Good" : "Needs Improvement"}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-600 to-emerald-700 text-white shadow-2xl border-0 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-14 translate-x-14"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Rental Income Analysis</h3>
                        <p className="text-sm text-green-100">Income and yield overview</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <BarChart3 className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-green-200" />
                          <div className="text-xs text-green-200">Annual Income</div>
                        </div>
                        <div className="text-2xl font-bold text-white">${((monthlyRent * 12) / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Percent className="h-4 w-4 text-yellow-200" />
                          <div className="text-xs text-green-200">Yield</div>
                        </div>
                        <div className="text-2xl font-bold text-yellow-300">{rentalYield.toFixed(2)}%</div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-green-200" />
                          <div className="text-xs text-green-200">10-Year Income</div>
                        </div>
                        <div className="text-2xl font-bold text-white">${((monthlyRent * 12 * 10) / 100000).toFixed(2)}L</div>
                      </div>
                    </div>

                    <div className="h-48 rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rentalBars}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                          <XAxis dataKey="label" stroke="rgba(255,255,255,0.8)" fontSize={12} />
                          <YAxis
                            stroke="rgba(255,255,255,0.8)"
                            tickFormatter={(v) =>
                              v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${(v / 1000).toFixed(0)}K`
                            }
                            fontSize={12}
                          />
                          <Legend />
                          <RechartsTooltip
                            contentStyle={{
                              background: "rgba(255,255,255,0.95)",
                              border: "1px solid rgba(0,0,0,0.1)",
                              color: "#1f2937",
                              borderRadius: "8px"
                            }}
                            formatter={(v: number) => [
                              v >= 100000 ? `$${(v / 100000).toFixed(2)}L` : `$${(v / 1000).toFixed(0)}K`,
                              "Value",
                            ]}
                          />
                          <Bar dataKey="value" name="Amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className={`p-4 rounded-lg text-center ${
                      rentalYield >= 4 
                        ? "bg-green-500/20 border border-green-400/30" 
                        : rentalYield >= 3 
                        ? "bg-yellow-500/20 border border-yellow-400/30" 
                        : "bg-red-500/20 border border-red-400/30"
                    }`}>
                      <div className={`text-sm font-bold ${
                        rentalYield >= 4 
                          ? "text-green-200" 
                          : rentalYield >= 3 
                          ? "text-yellow-200" 
                          : "text-red-200"
                      }`}>
                        Investment Grade: {rentalYield >= 4 ? "Excellent ⭐⭐⭐" : rentalYield >= 3 ? "Good ⭐⭐" : "Needs Improvement ⭐"}
                      </div>
                      <div className="text-xs text-white/80 mt-1">
                        {rentalYield >= 4 ? "Strong rental returns" : rentalYield >= 3 ? "Moderate returns" : "Consider better properties"}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* EMI Calculator */}
            <TabsContent value="emi">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900 dark:to-indigo-800">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                          <Calculator className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold">EMI Calculator</h3>
                          <p className="text-sm text-muted-foreground">Calculate your loan payments</p>
                        </div>
                      </div>
                      {selectedProperty && (
                        <Badge className="bg-purple-600 text-white text-xs">
                          Property #{relatedHouses.findIndex(h => h.id === selectedProperty.id) + 1}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Loan Amount Section */}
                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <Label htmlFor="loanAmt" className="font-medium text-blue-700 dark:text-blue-400">Loan Amount</Label>
                      </div>
                      <Input
                        id="loanAmt"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        inputMode="numeric"
                        className="text-lg font-semibold h-12"
                        placeholder="Enter loan amount"
                        aria-label="Loan Amount in Rupees"
                      />
                      <div className="mt-2 text-sm text-muted-foreground">
                        ${(loanAmount / 100000).toFixed(2)} Lakhs
                      </div>
                    </div>

                    {/* Interest Rate Section */}
                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                        <Label htmlFor="rate" className="font-medium text-orange-700 dark:text-orange-400">Interest Rate</Label>
                      </div>
                      <Input
                        id="rate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        inputMode="decimal"
                        className="text-lg font-semibold h-12"
                        placeholder="Enter interest rate"
                        aria-label="Interest Rate percentage"
                      />
                      <div className="mt-2 text-sm text-muted-foreground">
                        {interestRate}% per annum
                      </div>
                    </div>

                    {/* Loan Tenure Section */}
                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                        <Label htmlFor="tenure" className="font-medium text-green-700 dark:text-green-400">Loan Tenure</Label>
                      </div>
                      <Input
                        id="tenure"
                        type="number"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(Number(e.target.value))}
                        inputMode="numeric"
                        className="text-lg font-semibold h-12"
                        placeholder="Enter tenure in years"
                        aria-label="Loan Tenure in years"
                      />
                      <div className="mt-2 text-sm text-muted-foreground">
                        {loanTenure} years ({loanTenure * 12} months)
                      </div>
                    </div>

                    {/* EMI Preview */}
                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border">
                      <div className="text-center">
                        <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Monthly EMI</div>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                          ${emi.toFixed(0)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {((emi / monthlyRent) * 100).toFixed(1)}% of estimated rent
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                        <div className="text-xs text-blue-600 dark:text-blue-400">Total Interest</div>
                        <div className="font-semibold text-blue-700 dark:text-blue-300">
                          ${(totalInterest / 100000).toFixed(1)}L
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                        <div className="text-xs text-green-600 dark:text-green-400">Total Payment</div>
                        <div className="font-semibold text-green-700 dark:text-green-300">
                          ${((loanAmount + totalInterest) / 100000).toFixed(1)}L
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-2xl border-0 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-14 translate-x-14"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">EMI Breakdown</h3>
                        <p className="text-sm text-purple-100">Principal vs. interest analysis</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <PieChart className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-purple-200" />
                          <div className="text-xs text-purple-200">Monthly EMI</div>
                        </div>
                        <div className="text-3xl font-bold text-white">${emi.toFixed(0)}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-yellow-200" />
                          <div className="text-xs text-purple-200">Total Payment</div>
                        </div>
                        <div className="text-2xl font-bold text-yellow-300">
                          ${((loanAmount + (totalInterest > 0 ? totalInterest : 0)) / 100000).toFixed(2)}L
                        </div>
                      </div>
                    </div>

                    <div className="h-60 rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <RechartsTooltip
                            contentStyle={{
                              background: "rgba(255,255,255,0.95)",
                              border: "1px solid rgba(0,0,0,0.1)",
                              color: "#1f2937",
                              borderRadius: "8px"
                            }}
                            formatter={(v: number, n: string) => [`$${(v / 100000).toFixed(2)}L`, n]}
                          />
                          <Pie
                            data={emiPieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            innerRadius={35}
                            outerRadius={65}
                            paddingAngle={2}
                          >
                            {emiPieData.map((entry, index) => (
                              <Cell key={entry.name} fill={index === 0 ? "#10b981" : "#f59e0b"} />
                            ))}
                          </Pie>
                          <Legend 
                            verticalAlign="bottom" 
                            height={40}
                            wrapperStyle={{ 
                              paddingTop: "15px", 
                              fontSize: "12px",
                              color: "rgba(255,255,255,0.8)" 
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Additional metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Percent className="h-3 w-3 text-orange-200" />
                          <div className="text-xs text-purple-200">Interest Component</div>
                        </div>
                        <div className="text-lg font-bold text-orange-300">
                          ${(totalInterest > 0 ? totalInterest / 100000 : 0).toFixed(1)}L
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="h-3 w-3 text-blue-200" />
                          <div className="text-xs text-purple-200">EMI vs Rent</div>
                        </div>
                        <div className="text-lg font-bold text-blue-300">
                          {((emi / monthlyRent) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Property Comparison */}
            <TabsContent value="comparison">
              <PropertyComparisonComponent 
                onPropertySelect={handlePropertySelect}
                selectedPropertyId={selectedProperty?.id}
              />
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Analytics
