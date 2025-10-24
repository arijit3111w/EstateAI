"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, Banknote } from "lucide-react"

// The official Bank of Canada series for the Canadian Prime Rate
const PRIME_RATE_SERIES = "V121750"
const API_URL = `https://www.bankofcanada.ca/valet/observations/${PRIME_RATE_SERIES}/json?recent=1`

const CurrentPrimeRate = () => {
  const [primeRate, setPrimeRate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrimeRate = async () => {
      try {
        setLoading(true)
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error("Failed to fetch BoC data")
        }
        const data = await response.json()
        
        // Navigate the complex JSON structure from the API
        const rateValue = data?.observations?.[0]?.[PRIME_RATE_SERIES]?.v
        
        if (rateValue) {
          setPrimeRate(Number(rateValue).toFixed(2))
        } else {
          setPrimeRate("N/A")
        }
      } catch (error) {
        console.error("Error fetching prime rate:", error)
        setPrimeRate("N/A")
      } finally {
        setLoading(false)
      }
    }

    fetchPrimeRate()
  }, [])

  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">BoC Prime Rate</span>
        <Banknote className="h-4 w-4 text-chart-3" aria-hidden="true" />
      </div>
      {loading ? (
        <div className="mt-1 text-2xl font-semibold animate-pulse">...%</div>
      ) : (
        <div className="mt-1 text-2xl font-semibold">{primeRate}%</div>
      )}
      <div className="text-xs text-muted-foreground">Official Canadian Rate</div>
    </Card>
  )
}

export default CurrentPrimeRate