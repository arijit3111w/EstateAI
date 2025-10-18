import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, Database, Info } from 'lucide-react';

interface FirestoreNoticeProps {
  className?: string;
}

const FirestoreNotice: React.FC<FirestoreNoticeProps> = ({ className = '' }) => {
  const handleFirebaseConsole = () => {
    window.open('https://console.firebase.google.com/', '_blank');
  };

  return (
    <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
      <Database className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium text-blue-800 mb-1">
            Running in Local Mode
          </div>
          <div className="text-blue-700 text-sm">
            Your preferences are stored locally. To sync across devices, set up Firestore in Firebase Console.
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleFirebaseConsole}
          className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Setup
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default FirestoreNotice;