import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeatmapView from '@/components/HeatmapView';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const Heatmap = () => {
  const { t } = useLanguage();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">{t('heatmap.title')}</h1>
            <p className="text-xl text-primary-foreground/90">
              {t('heatmap.subtitle')}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="p-6 mb-6 shadow-lg border-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">Price Range (CAD)</label>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={2000000}
                      step={50000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded">${(priceRange[0] / 1000).toFixed(0)}K</span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">${(priceRange[1] / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">Property Grade</label>
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Select grade range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="luxury">Luxury (Grade 9+)</SelectItem>
                      <SelectItem value="premium">Premium (Grade 7-8)</SelectItem>
                      <SelectItem value="standard">Standard (Grade 5-6)</SelectItem>
                      <SelectItem value="budget">Budget (Grade 1-4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Heat Map Legend</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <div className="w-4 h-4 bg-green-500 rounded border-2 border-white shadow-sm"></div>
                    <span className="text-xs font-medium text-green-800">&lt; $600K</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                    <div className="w-4 h-4 bg-yellow-500 rounded border-2 border-white shadow-sm"></div>
                    <span className="text-xs font-medium text-yellow-800">$600K - $800K</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <div className="w-4 h-4 bg-orange-500 rounded border-2 border-white shadow-sm"></div>
                    <span className="text-xs font-medium text-orange-800">$800K - $1.2M</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <div className="w-4 h-4 bg-red-500 rounded border-2 border-white shadow-sm"></div>
                    <span className="text-xs font-medium text-red-800">&gt; $1.2M</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Colored zones show average prices in different areas. Click zones for details.
                </p>
              </div>
            </div>
          </Card>

          {/* Heatmap */}
          <Card className="p-0 overflow-hidden">
            <div className="h-[500px] md:h-[600px] lg:h-[650px]">
              <ErrorBoundary>
                <HeatmapView priceRange={priceRange} gradeFilter={gradeFilter} />
              </ErrorBoundary>
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card className="p-6 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-green-700 text-lg">Affordable</h3>
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Budget-friendly homes under <strong>$600K CAD</strong>. Perfect for first-time buyers and young families entering the market.
              </p>
              <div className="mt-3 text-xs text-green-600 font-medium">Great entry-level options</div>
            </Card>

            <Card className="p-6 border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-white hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-yellow-700 text-lg">Mid-Range</h3>
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$$</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Well-positioned properties <strong>$600K-$800K CAD</strong>. Balanced value with good amenities and location advantages.
              </p>
              <div className="mt-3 text-xs text-yellow-600 font-medium">Best value proposition</div>
            </Card>

            <Card className="p-6 border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-orange-700 text-lg">Expensive</h3>
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$$$</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                High-end homes <strong>$800K-$1.2M CAD</strong> in desirable neighborhoods with premium features and excellent schools.
              </p>
              <div className="mt-3 text-xs text-orange-600 font-medium">Premium neighborhoods</div>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-red-700 text-lg">Luxury</h3>
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$$$$</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Luxury properties above <strong>$1.2M CAD</strong> with exclusive features, prime locations, and exceptional quality.
              </p>
              <div className="mt-3 text-xs text-red-600 font-medium">Exclusive locations</div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Heatmap;
