import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastMessage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { toast } = state.ui;

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`rounded-lg border p-4 shadow-lg ${getBgColor()}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">
              {toast.message}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <button
              className="inline-flex text-gray-400 hover:text-gray-600"
              onClick={() => dispatch({ type: 'HIDE_TOAST' })}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;