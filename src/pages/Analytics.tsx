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
import { Calculator, TrendingUp, Home, DollarSign, BarChart3, PieChart, LinkIcon as LineIcon } from "lucide-react"
import analyticsBackground from "@/assets/analytics-bg.jpg"
import { usePrediction } from "@/contexts/PredictionContext"
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
                  Investment Analytics Dashboard
                </h1>
                <p className="mt-2 text-base md:text-lg text-white/90 text-pretty">
                  Make data-driven real estate decisions with ROI, rental, and EMI insights.
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
                  <h4 className="font-semibold">Currently Analyzing</h4>
                  <p className="text-blue-100 text-sm">
                    Property #{relatedHouses.findIndex(h => h.id === selectedProperty.id) + 1} • 
                    {selectedProperty.bedrooms}BR/{selectedProperty.bathrooms}BA • 
                    {selectedProperty.living_area.toLocaleString()} sqft • 
                    Grade {selectedProperty.grade}
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
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">10Y ROI</span>
                <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
              </div>
              <div className="mt-1 text-2xl font-semibold">{roi.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Projection based on appreciation</div>
            </Card>
            <Card className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rental Yield</span>
                <Home className="h-4 w-4 text-chart-2" aria-hidden="true" />
              </div>
              <div className="mt-1 text-2xl font-semibold">{rentalYield.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">Annual rent vs. property value</div>
            </Card>
            <Card className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly EMI</span>
                <DollarSign className="h-4 w-4 text-chart-5" aria-hidden="true" />
              </div>
              <div className="mt-1 text-2xl font-semibold">₹{emi.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Based on rate and tenure</div>
            </Card>
            <Card className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Interest</span>
                <PieChart className="h-4 w-4 text-chart-1" aria-hidden="true" />
              </div>
              <div className="mt-1 text-2xl font-semibold">₹{(totalInterest / 100000).toFixed(2)}L</div>
              <div className="text-xs text-muted-foreground">Over full loan tenure</div>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <Tabs defaultValue="roi" className="space-y-6 md:space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="roi" className="flex items-center gap-2">
                <LineIcon className="h-4 w-4" /> ROI
              </TabsTrigger>
              <TabsTrigger value="rental" className="flex items-center gap-2">
                <Home className="h-4 w-4" /> Rental
              </TabsTrigger>
              <TabsTrigger value="emi" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" /> EMI
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Compare
              </TabsTrigger>
            </TabsList>

            {/* ROI Calculator */}
            <TabsContent value="roi">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <Card className="p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Investment Details
                    {selectedProperty && (
                      <div className="ml-auto">
                        <Badge className="bg-blue-600 text-white text-xs">
                          Analyzing: Property #{relatedHouses.findIndex(h => h.id === selectedProperty.id) + 1}
                        </Badge>
                      </div>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Purchase Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                        inputMode="numeric"
                        aria-label="Purchase Price in Rupees"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loan">Loan Amount (₹)</Label>
                      <Input
                        id="loan"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        inputMode="numeric"
                        aria-label="Loan Amount in Rupees"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="appreciation">Expected Appreciation (%/year)</Label>
                      <Input
                        id="appreciation"
                        type="number"
                        value={appreciation}
                        onChange={(e) => setAppreciation(Number(e.target.value))}
                        step="0.1"
                        aria-label="Expected Appreciation percentage per year"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">10-Year Projection</h3>
                      <p className="text-sm text-blue-100">Future value growth based on appreciation</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-blue-200" aria-hidden="true" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-blue-200">Total Investment</div>
                      <div className="text-2xl font-semibold text-white">
                        ₹{((purchasePrice - loanAmount) / 100000).toFixed(2)}L
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-200">Expected ROI</div>
                      <div className="text-2xl font-semibold text-green-300">{roi.toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-200">Future Value</div>
                      <div className="text-2xl font-semibold text-white">
                        ₹{(projectionData[projectionData.length - 1].value / 100000).toFixed(2)}L
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-200">Profit</div>
                      <div className="text-2xl font-semibold text-green-300">
                        ₹{((projectionData[projectionData.length - 1].value - purchasePrice) / 100000).toFixed(2)}L
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-40 md:h-48 rounded-md bg-white/10 backdrop-blur-sm p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={projectionData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.8)" />
                        <YAxis
                          stroke="rgba(255,255,255,0.8)"
                          tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            background: "rgba(255,255,255,0.95)",
                            border: "1px solid rgba(0,0,0,0.1)",
                            color: "#1f2937"
                          }}
                          formatter={(v: number) => [`₹${(v / 100000).toFixed(2)}L`, "Value"]}
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
                </Card>
              </div>
            </TabsContent>

            {/* Rental Income Analyzer */}
            <TabsContent value="rental">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <Card className="p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    Rental Details
                    {selectedProperty && (
                      <div className="ml-auto">
                        <Badge className="bg-green-600 text-white text-xs">
                          Property #{relatedHouses.findIndex(h => h.id === selectedProperty.id) + 1}
                        </Badge>
                      </div>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rent">Expected Monthly Rent (₹)</Label>
                      <Input
                        id="rent"
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        inputMode="numeric"
                        aria-label="Expected Monthly Rent in Rupees"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label aria-hidden="true">Property Value (₹)</Label>
                      <div className="text-2xl font-semibold text-primary">₹{(purchasePrice / 100000).toFixed(2)}L</div>
                      <span className="sr-only">Property Value in Lakhs</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-600 to-green-700 text-white shadow-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">Rental Income Analysis</h3>
                      <p className="text-sm text-green-100">Income and yield overview</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-green-200" aria-hidden="true" />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-green-200">Annual Income</div>
                      <div className="text-2xl font-semibold text-white">₹{((monthlyRent * 12) / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <div className="text-xs text-green-200">Yield</div>
                      <div className="text-2xl font-semibold text-yellow-300">{rentalYield.toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-green-200">10-Year Income</div>
                      <div className="text-2xl font-semibold text-white">₹{((monthlyRent * 12 * 10) / 100000).toFixed(2)}L</div>
                    </div>
                  </div>

                  <div className="mt-6 h-40 md:h-48 rounded-md bg-white/10 backdrop-blur-sm p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rentalBars}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="label" stroke="rgba(255,255,255,0.8)" />
                        <YAxis
                          stroke="rgba(255,255,255,0.8)"
                          tickFormatter={(v) =>
                            v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${(v / 1000).toFixed(0)}K`
                          }
                        />
                        <Legend />
                        <RechartsTooltip
                          contentStyle={{
                            background: "rgba(255,255,255,0.95)",
                            border: "1px solid rgba(0,0,0,0.1)",
                            color: "#1f2937"
                          }}
                          formatter={(v: number) => [
                            v >= 100000 ? `₹${(v / 100000).toFixed(2)}L` : `₹${(v / 1000).toFixed(0)}K`,
                            "Value",
                          ]}
                        />
                        <Bar dataKey="value" name="Amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={`mt-4 ${rentalYield >= 3 ? "text-green-200" : "text-red-200"}`}>
                    <div className="text-sm">Assessment:</div>
                    <div className="font-semibold">
                      {rentalYield >= 4 ? "Excellent" : rentalYield >= 3 ? "Good" : "Needs Improvement"}
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* EMI Calculator */}
            <TabsContent value="emi">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <Card className="p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Loan Details
                    {selectedProperty && (
                      <div className="ml-auto">
                        <Badge className="bg-purple-600 text-white text-xs">
                          Property #{relatedHouses.findIndex(h => h.id === selectedProperty.id) + 1}
                        </Badge>
                      </div>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmt">Loan Amount (₹)</Label>
                      <Input
                        id="loanAmt"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        inputMode="numeric"
                        aria-label="Loan Amount in Rupees"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Interest Rate (%)</Label>
                      <Input
                        id="rate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        inputMode="decimal"
                        aria-label="Interest Rate percentage"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                      <Input
                        id="tenure"
                        type="number"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(Number(e.target.value))}
                        inputMode="numeric"
                        aria-label="Loan Tenure in years"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">EMI Breakdown</h3>
                      <p className="text-sm text-purple-100">Principal vs. interest share</p>
                    </div>
                    <PieChart className="h-5 w-5 text-purple-200" aria-hidden="true" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-purple-200">Monthly EMI</div>
                      <div className="text-3xl font-semibold text-white">₹{emi.toFixed(0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-200">Total Payment</div>
                      <div className="text-2xl font-semibold text-yellow-300">
                        ₹{((loanAmount + totalInterest) / 100000).toFixed(2)}L
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-44 md:h-52 rounded-md bg-white/10 backdrop-blur-sm p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <RechartsTooltip
                          contentStyle={{
                            background: "rgba(255,255,255,0.95)",
                            border: "1px solid rgba(0,0,0,0.1)",
                            color: "#1f2937"
                          }}
                          formatter={(v: number, n: string) => [`₹${(v / 100000).toFixed(2)}L`, n]}
                        />
                        <Pie
                          data={emiPieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                        >
                          {emiPieData.map((entry, index) => (
                            <Cell key={entry.name} fill={index === 0 ? "#10b981" : "#f59e0b"} />
                          ))}
                        </Pie>
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
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
