import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { FontIcon } from './icons/FontIcon';
import { SmileyIcon } from './icons/SmileyIcon';
// The 'ProcessingMode' type will be updated once App.tsx definition changes.
import type { ProcessingMode as AppProcessingMode } from '../App';


interface TextProcessorFormProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  mode: Extract<AppProcessingMode, 'spellcheck' | 'roqaa' | 'emoji'>; // Specific modes this form handles
}

export const TextProcessorForm: React.FC<TextProcessorFormProps> = ({
  inputText,
  onInputChange,
  onSubmit,
  isLoading,
  mode,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  let buttonText = '';
  let ButtonIconComponent = MagicWandIcon; // Default
  let placeholderText = '';
  let loadingText = '';

  switch (mode) {
    case 'spellcheck':
      buttonText = 'تدقيق إملائي';
      ButtonIconComponent = MagicWandIcon;
      placeholderText = "أدخل النص هنا للتدقيق الإملائي...";
      loadingText = 'جاري التدقيق...';
      break;
    case 'roqaa':
      buttonText = 'تحويل إلى الرقعة';
      ButtonIconComponent = FontIcon;
      placeholderText = "أدخل النص هنا لتحويله إلى خط الرقعة...";
      loadingText = 'جاري التحويل...';
      break;
    case 'emoji':
      buttonText = 'اقتراح إيموجي';
      ButtonIconComponent = SmileyIcon;
      placeholderText = "أدخل النص هنا لاقتراح إيموجي مناسب...";
      loadingText = 'جاري اقتراح الإيموجي...';
      break;
    // No default needed as mode is constrained by type
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="inputText" className="block text-sm font-medium text-slate-700 mb-1">
          النص الأصلي
        </label>
        <textarea
          id="inputText"
          name="inputText"
          rows={6}
          className="block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-150 ease-in-out placeholder-slate-400 resize-none"
          placeholder={placeholderText}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          dir="rtl"
          disabled={isLoading}
          aria-label="النص الأصلي"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !inputText.trim()}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
        aria-live="polite"
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="w-5 h-5 me-2" />
            {loadingText}
          </>
        ) : (
          <>
            <ButtonIconComponent className="w-5 h-5 me-2" aria-hidden="true" />
            {buttonText}
          </>
        )}
      </button>
    </form>
  );
};
