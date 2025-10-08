import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeatmapView from '@/components/HeatmapView';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const Heatmap = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Interactive Price Heatmap</h1>
            <p className="text-xl text-primary-foreground/90">
              Visualize property prices across regions with color-coded zones
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
                <div className="space-y-2">
                  <Slider
                    min={0}
                    max={2000000}
                    step={50000}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{(priceRange[0] / 100000).toFixed(1)}L</span>
                    <span>₹{(priceRange[1] / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Grade</label>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="luxury">Luxury (10+)</SelectItem>
                    <SelectItem value="premium">Premium (8-9)</SelectItem>
                    <SelectItem value="standard">Standard (5-7)</SelectItem>
                    <SelectItem value="budget">Budget (1-4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="w-full">
                  <div className="text-sm font-medium mb-2">Heat Map Legend</div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-success rounded"></div>
                      <span>Affordable</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-secondary rounded"></div>
                      <span>Mid-Range</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-destructive rounded"></div>
                      <span>Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Heatmap */}
          <Card className="p-0 overflow-hidden">
            <div className="h-[700px]">
              <HeatmapView priceRange={priceRange} gradeFilter={gradeFilter} />
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Red Zones</h3>
              <p className="text-sm text-muted-foreground">
                High-value areas with premium properties and luxury homes
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Yellow Zones</h3>
              <p className="text-sm text-muted-foreground">
                Mid-range areas with good value for money and growing demand
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Green Zones</h3>
              <p className="text-sm text-muted-foreground">
                Affordable areas perfect for first-time buyers and investors
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Heatmap;
