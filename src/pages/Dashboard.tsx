"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Home, DollarSign, Activity, Database, ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-6">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                  <BarChart3 className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Real Estate Analytics Dashboard
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                Comprehensive market insights, trends, and data visualization for informed real estate decisions
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-green-300" />
                  </div>
                  <div className="text-2xl font-bold">98.2%</div>
                  <div className="text-sm text-white/80">Data Accuracy</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Home className="h-6 w-6 text-blue-300" />
                  </div>
                  <div className="text-2xl font-bold">15K+</div>
                  <div className="text-sm text-white/80">Properties</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className="h-6 w-6 text-purple-300" />
                  </div>
                  <div className="text-2xl font-bold">Real-time</div>
                  <div className="text-sm text-white/80">Updates</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Database className="h-6 w-6 text-orange-300" />
                  </div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-white/80">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Container */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Power BI Analytics Dashboard</h2>
                <p className="text-muted-foreground">Interactive real estate market analysis and insights</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Market Trends
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Price Analysis
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                Property Insights
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                Location Data
              </Badge>
            </div>
          </div>

          {/* Power BI Dashboard Iframe Container */}
          <Card className="p-0 border-0 shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                    EstateAI Analytics Dashboard
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Live Data
                </Badge>
              </div>
            </div>
            
            <div className="relative w-full" style={{ height: "600px" }}>
              <iframe 
                title="Arijit_HP_Dashboard" 
                width="100%" 
                height="100%" 
                src="https://app.powerbi.com/view?r=eyJrIjoiMTY2NTRkNzEtNjY3ZS00YzhiLTkyYjgtOTdjMTVhZTI2NTk3IiwidCI6ImM4YTFlMGUxLWU3MjUtNGE2Ni1iMTgxLWViODU0NWQ5N2IwZiJ9&pageName=52e888de03a909153d90" 
                frameBorder="0" 
                allowFullScreen={true}
                className="rounded-b-lg"
                style={{ border: "none" }}
              />
            </div>
          </Card>

          {/* Dashboard Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg">Market Trends</h3>
              </div>
              <p className="text-muted-foreground">
                Real-time market trend analysis with historical data comparison and future projections.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg">Price Analytics</h3>
              </div>
              <p className="text-muted-foreground">
                Comprehensive price analysis across different property types, locations, and market segments.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Home className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg">Property Insights</h3>
              </div>
              <p className="text-muted-foreground">
                Detailed property insights including performance metrics, ROI analysis, and investment opportunities.
              </p>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-12">
            <Link to="/predict">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Start Property Analysis
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" size="lg">
                View Investment Calculator
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard