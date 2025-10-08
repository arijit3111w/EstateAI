import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, Home, DollarSign } from 'lucide-react';
import analyticsImg from '@/assets/analytics-bg.jpg';

const Analytics = () => {
  const [purchasePrice, setPurchasePrice] = useState(1000000);
  const [loanAmount, setLoanAmount] = useState(800000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [appreciation, setAppreciation] = useState(8);

  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const tenure = loanTenure * 12;
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return emi;
  };

  const calculateROI = () => {
    const years = 10;
    const futureValue = purchasePrice * Math.pow(1 + appreciation / 100, years);
    const totalInvestment = purchasePrice - loanAmount;
    const roi = ((futureValue - purchasePrice) / totalInvestment) * 100;
    return roi;
  };

  const calculateRentalYield = () => {
    const annualRent = monthlyRent * 12;
    const yield_percent = (annualRent / purchasePrice) * 100;
    return yield_percent;
  };

  const emi = calculateEMI();
  const roi = calculateROI();
  const rentalYield = calculateRentalYield();
  const totalInterest = (emi * loanTenure * 12) - loanAmount;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden">
          <img src={analyticsImg} alt="Analytics" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Investment Analytics Dashboard</h1>
              <p className="text-xl">Make data-driven real estate decisions</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="roi" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
              <TabsTrigger value="rental">Rental Analyzer</TabsTrigger>
              <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            {/* ROI Calculator */}
            <TabsContent value="roi">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Investment Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="price">Purchase Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="loan">Loan Amount (₹)</Label>
                      <Input
                        id="loan"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="appreciation">Expected Appreciation (%/year)</Label>
                      <Input
                        id="appreciation"
                        type="number"
                        value={appreciation}
                        onChange={(e) => setAppreciation(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-primary text-white">
                  <h3 className="text-xl font-semibold mb-6">10-Year Projection</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm opacity-90">Total Investment</div>
                      <div className="text-3xl font-bold">₹{((purchasePrice - loanAmount) / 100000).toFixed(2)}L</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Expected ROI</div>
                      <div className="text-3xl font-bold">{roi.toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Future Value</div>
                      <div className="text-3xl font-bold">
                        ₹{((purchasePrice * Math.pow(1 + appreciation / 100, 10)) / 100000).toFixed(2)}L
                      </div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Profit</div>
                      <div className="text-3xl font-bold text-secondary">
                        ₹{(((purchasePrice * Math.pow(1 + appreciation / 100, 10)) - purchasePrice) / 100000).toFixed(2)}L
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Rental Income Analyzer */}
            <TabsContent value="rental">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    Rental Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rent">Expected Monthly Rent (₹)</Label>
                      <Input
                        id="rent"
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Property Value (₹)</Label>
                      <div className="text-2xl font-bold text-primary">₹{(purchasePrice / 100000).toFixed(2)}L</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-luxury">
                  <h3 className="text-xl font-semibold mb-6">Rental Income Analysis</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm opacity-90">Annual Rental Income</div>
                      <div className="text-3xl font-bold">₹{((monthlyRent * 12) / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Rental Yield</div>
                      <div className="text-3xl font-bold">{rentalYield.toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">10-Year Rental Income</div>
                      <div className="text-3xl font-bold">₹{((monthlyRent * 12 * 10) / 100000).toFixed(2)}L</div>
                    </div>
                    <div className={rentalYield >= 3 ? 'text-success' : 'text-destructive'}>
                      <div className="text-sm">Assessment:</div>
                      <div className="font-semibold">
                        {rentalYield >= 4 ? 'Excellent' : rentalYield >= 3 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* EMI Calculator */}
            <TabsContent value="emi">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Loan Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="loanAmt">Loan Amount (₹)</Label>
                      <Input
                        id="loanAmt"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rate">Interest Rate (%)</Label>
                      <Input
                        id="rate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                      <Input
                        id="tenure"
                        type="number"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-primary text-primary-foreground">
                  <h3 className="text-xl font-semibold mb-6">EMI Breakdown</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm opacity-90">Monthly EMI</div>
                      <div className="text-4xl font-bold">₹{emi.toFixed(0)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm opacity-90">Principal</div>
                        <div className="text-xl font-bold">₹{(loanAmount / 100000).toFixed(2)}L</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-90">Total Interest</div>
                        <div className="text-xl font-bold">₹{(totalInterest / 100000).toFixed(2)}L</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Total Payment</div>
                      <div className="text-3xl font-bold text-secondary">
                        ₹{((loanAmount + totalInterest) / 100000).toFixed(2)}L
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Property Comparison */}
            <TabsContent value="comparison">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Investment Comparison Tool
                </h3>
                <p className="text-muted-foreground mb-6">
                  Compare multiple properties side-by-side based on ROI, rental yield, and projected returns
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 border-primary">
                    <h4 className="font-semibold mb-2">Property A</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">₹10L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ROI:</span>
                        <span className="font-medium text-success">{roi.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Yield:</span>
                        <span className="font-medium">{rentalYield.toFixed(2)}%</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Add Property B</h4>
                    <Button variant="outline" className="w-full">
                      + Add for Comparison
                    </Button>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Add Property C</h4>
                    <Button variant="outline" className="w-full">
                      + Add for Comparison
                    </Button>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
