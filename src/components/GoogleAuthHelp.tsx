import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const GoogleAuthHelp: React.FC = () => {
  return (
    <Alert className="border-orange-200 bg-orange-50">
      <Info className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="font-medium mb-2">Having trouble with Google Sign-in?</div>
        <div className="text-sm space-y-1">
          <div>• Make sure to allow popups for this website</div>
          <div>• Check if you have popup blockers enabled</div>
          <div>• Try using email/password sign-in as an alternative</div>
          <div>• Make sure third-party cookies are enabled</div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default GoogleAuthHelp;