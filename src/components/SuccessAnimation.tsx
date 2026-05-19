import { useEffect } from 'react';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  message: string;
  onComplete?: () => void;
}

export function SuccessAnimation({ message, onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl transform animate-bounce-in">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-emerald-500 rounded-full p-6 animate-scale-in">
            <Check className="w-16 h-16 text-white" strokeWidth={3} />
          </div>
          <p className="text-xl font-bold text-gray-800 dark:text-white text-center">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
