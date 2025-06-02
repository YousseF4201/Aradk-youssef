import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ClipboardCopyIcon } from './icons/ClipboardCopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { FontIcon } from './icons/FontIcon';
import { SmileyIcon } from './icons/SmileyIcon';
import { QuillIcon } from './icons/QuillIcon'; // New Icon
import { diffWords } from 'diff';
import type { ProcessingMode } from '../App';

interface ProcessedResultDisplayProps {
  processedText: string; // Generic name for the result
  isLoading: boolean;
  error: string | null;
  originalText: string; // For spellcheck diff, or context for poem (e.g., "الاسم: فلان, الجنس: ذكر")
  mode: ProcessingMode;
}

export const ProcessedResultDisplay: React.FC<ProcessedResultDisplayProps> = ({
  processedText,
  isLoading,
  error,
  originalText,
  mode
}) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = async () => {
    if (processedText) {
      try {
        await navigator.clipboard.writeText(processedText);
        setIsCopied(true);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  let loadingMessage = 'جاري المعالجة...';
  let errorMessageTitle = 'خطأ في المعالجة';
  let initialMessageText = "أدخل البيانات في الأعلى واضغط على زر المعالجة لعرض النتائج هنا.";

  switch(mode) {
    case 'spellcheck':
      loadingMessage = 'جاري البحث عن التصحيحات...';
      errorMessageTitle = 'خطأ في التدقيق';
      initialMessageText = "أدخل نصًا في الأعلى واضغط على زر التدقيق لعرض النتائج هنا.";
      break;
    case 'roqaa':
      loadingMessage = 'جاري تحويل النص إلى الرقعة...';
      errorMessageTitle = 'خطأ في التحويل إلى الرقعة';
      initialMessageText = "أدخل نصًا في الأعلى واضغط على زر التحويل لعرض النص بخط الرقعة هنا.";
      break;
    case 'emoji':
      loadingMessage = 'جاري اقتراح الإيموجي...';
      errorMessageTitle = 'خطأ في اقتراح الإيموجي';
      initialMessageText = "أدخل نصًا في الأعلى واضغط على زر اقتراح الإيموجي لعرض النتائج هنا.";
      break;
    case 'poem':
      loadingMessage = 'جاري كتابة القصيدة...';
      errorMessageTitle = 'خطأ في إنشاء القصيدة';
      initialMessageText = "أدخل اسم الشخص وجنسه في الأعلى واضغط على زر إنشاء القصيدة لعرضها هنا.";
      break;
  }


  if (isLoading && !error && !processedText) {
    return (
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md text-center" aria-live="polite">
        <LoadingSpinner className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
        <p className="text-slate-600">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 border border-red-300 rounded-lg shadow-md" role="alert">
        <div className="flex items-center text-red-700">
          <AlertTriangleIcon className="w-6 h-6 me-3 flex-shrink-0" aria-hidden="true" />
          <h3 className="text-lg font-semibold">{errorMessageTitle}</h3>
        </div>
        <p className="mt-2 text-red-600">{error}</p>
      </div>
    );
  }

  if (!isLoading && processedText) {
    const isUnchangedSpellcheck = mode === 'spellcheck' && originalText.trim() === processedText.trim();
    
    let SuccessIcon = CheckCircleIcon;
    let successTitle = "النتيجة";
    let successBg = 'bg-gray-50 border-gray-300'; // Default
    let successTextColor = 'text-gray-700'; // Default
    let copyButtonText = 'نسخ النص الناتج';

    if (mode === 'spellcheck') {
      SuccessIcon = CheckCircleIcon;
      successTitle = isUnchangedSpellcheck ? "النص الأصلي صحيح" : "النص المصحح";
      successBg = 'bg-green-50 border-green-300';
      successTextColor = 'text-green-700';
      copyButtonText = 'نسخ النص المصحح';
    } else if (mode === 'roqaa') {
      SuccessIcon = FontIcon;
      successTitle = "النص بخط الرقعة";
      successBg = 'bg-blue-50 border-blue-300';
      successTextColor = 'text-blue-700';
      copyButtonText = 'نسخ النص المحول';
    } else if (mode === 'emoji') {
      SuccessIcon = SmileyIcon;
      successTitle = "النص مع الإيموجي المقترحة";
      successBg = 'bg-yellow-50 border-yellow-300';
      successTextColor = 'text-yellow-800'; // Darker yellow for text
      copyButtonText = 'نسخ النص مع الإيموجي';
    } else if (mode === 'poem') {
      SuccessIcon = QuillIcon;
      // originalText in poem mode contains "الاسم: ..., الجنس: ..."
      const nameMatch = originalText.match(/الاسم: ([^,]+)/);
      successTitle = nameMatch ? `قصيدة لـ ${nameMatch[1].trim()}` : "القصيدة الناتجة";
      successBg = 'bg-purple-50 border-purple-300';
      successTextColor = 'text-purple-700';
      copyButtonText = 'نسخ القصيدة';
    }


    return (
      <div className={`mt-8 p-6 ${successBg} rounded-lg shadow-md`} role="region" aria-labelledby="result-title">
        <div className={`flex items-center ${successTextColor}`}>
          <SuccessIcon className="w-6 h-6 me-3 flex-shrink-0" aria-hidden="true" />
          <h3 id="result-title" className="text-lg font-semibold">
            {successTitle}
          </h3>
        </div>
        {(mode === 'spellcheck' && isUnchangedSpellcheck) ? (
          <p className="mt-2 text-slate-700" dir="rtl">
            لم يتم العثور على أخطاء إملائية أو نحوية في النص الذي أدخلته.
          </p>
        ) : (
          <>
            <div 
              className={`mt-2 text-slate-700 whitespace-pre-wrap ${mode === 'roqaa' ? "font-['Aref_Ruqaa'] text-xl" : ""} ${mode === 'poem' ? "text-base" : ""}`} 
              dir="rtl"
            >
              {mode === 'spellcheck' ? (
                diffWords(originalText.trim(), processedText.trim()).map((part, index) => {
                  if (part.added) {
                    return <span key={index} className="bg-green-200 text-green-800 px-0.5 rounded-sm">{part.value}</span>;
                  }
                  if (part.removed) {
                    return <span key={index} className="bg-red-200 text-red-800 line-through px-0.5 rounded-sm">{part.value}</span>;
                  }
                  return <span key={index}>{part.value}</span>;
                })
              ) : (
                // For Roqaa, Emoji, and Poem modes, display processed text directly
                processedText
              )}
            </div>
            <button
              onClick={handleCopy}
              disabled={isCopied}
              className={`mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isCopied
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : (mode === 'poem' ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500')
              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out`}
              aria-label={isCopied ? "تم نسخ النص" : "نسخ النص الناتج"}
            >
              {isCopied ? (
                <>
                  <CheckIcon className="w-5 h-5 me-2" aria-hidden="true" />
                  تم النسخ!
                </>
              ) : (
                <>
                  <ClipboardCopyIcon className="w-5 h-5 me-2" aria-hidden="true" />
                  {copyButtonText}
                </>
              )}
            </button>
          </>
        )}
      </div>
    );
  }
  
  // Condition for initial message (no processing attempted yet, or input cleared)
  // Check if originalText is empty for modes that use it directly (spellcheck, roqaa, emoji)
  // For poem mode, originalText is derived, so check if processedText is empty and no error/loading
  const showInitialMessage = !isLoading && !error && !processedText &&
                             ((mode !== 'poem' && !originalText.trim()) || mode === 'poem');


  if (showInitialMessage) {
     return (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md text-center">
            <p className="text-slate-500">{initialMessageText}</p>
        </div>
    );
  }

  return null; 
};
