"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ArrowRight } from "lucide-react";

// --- (1) EXPORT THE BANK TYPE ---
export interface Bank {
  name: string;
  link: string;
  logoFallback: string;
  description: string;
}

interface LoanSuggestionsProps {
  banks: Bank[];
}

/**
 * A sub-component to render a single bank card.
 */
const BankCard = ({ bank }: { bank: Bank }) => {
  return (
    <Card className="w-64 flex-shrink-0 shadow-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center gap-4">
          {/* Logo Placeholder */}
          <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-muted dark:bg-slate-700 flex items-center justify-center">
            <span className="text-2xl font-bold text-muted-foreground dark:text-slate-300">
              {bank.logoFallback}
            </span>
          </div>
          {/* Bank Name */}
          <CardTitle className="text-lg font-semibold leading-tight">
            {bank.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Bank Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">
          {bank.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full text-blue-600 dark:text-blue-400 dark:hover:bg-slate-700">
          <a href={bank.link} target="_blank" rel="noopener noreferrer">
            {/* You might want to translate this button text too */}
            Explore Options
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

/**
 * A component that displays a horizontal scroller of bank suggestions.
 */
const LoanSuggestions = ({ banks }: LoanSuggestionsProps) => {
  return (
    <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
          <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold">
            Loan Mortgages
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore top lenders and mortgage options tailored for you.
          </p>
        </div>
      </div>

      {/* Horizontal Scroller */}
      <div className="flex overflow-x-auto space-x-4 pb-4 -mb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {banks.map((bank) => (
          <BankCard key={bank.name} bank={bank} />
        ))}
      </div>
    </Card>
  );
};

export default LoanSuggestions;