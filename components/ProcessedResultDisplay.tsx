import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ClipboardCopyIcon } from './icons/ClipboardCopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { FontIcon } from './icons/FontIcon';
import { SmileyIcon } from './icons/SmileyIcon';
import { QuillIcon } from './icons/QuillIcon'; 
import { diffWords } from 'diff';
import type { ProcessingMode, PoemLanguage, Gender } from '../App'; // Added PoemLanguage, Gender

interface ProcessedResultDisplayProps {
  processedText: string; 
  isLoading: boolean;
  error: string | null;
  originalText: string; 
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
  
  let SuccessIconComponent = CheckCircleIcon; // Default
  let successTitle = "النتيجة";
  let copyButtonText = 'نسخ النص الناتج';
  
  const successCardBaseBg = 'bg-slate-50';
  const successCardBorder = 'border-slate-300';
  const successIconColor = 'text-orange-500';
  const successTitleColor = 'text-orange-600';
  const copyButtonBgColor = 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500';


  switch(mode) {
    case 'spellcheck':
      loadingMessage = 'جاري البحث عن التصحيحات...';
      errorMessageTitle = 'خطأ في التدقيق';
      initialMessageText = "أدخل نصًا في الأعلى واضغط على زر التدقيق لعرض النتائج هنا.";
      SuccessIconComponent = CheckCircleIcon;
      successTitle = originalText.trim() === processedText.trim() ? "النص الأصلي صحيح" : "النص المصحح";
      copyButtonText = 'نسخ النص المصحح';
      break;
    case 'roqaa':
      loadingMessage = 'جاري تحويل النص إلى الرقعة...';
      errorMessageTitle = 'خطأ في التحويل إلى الرقعة';
      initialMessageText = "أدخل نصًا في الأعلى واضغط على زر التحويل لعرض النص بخط الرقعة هنا.";
      SuccessIconComponent = FontIcon;
      successTitle = "النص بخط الرقعة";
      copyButtonText = 'نسخ النص المحول';
      break;
    case 'emoji':
      loadingMessage = 'جاري اقتراح الإيموجي...';
      errorMessageTitle = 'خطأ في اقتراح الإيموجي';
      initialMessageText = "أدخل نصًا في الأعلى واضغط على زر اقتراح الإيموجي لعرض النتائج هنا.";
      SuccessIconComponent = SmileyIcon;
      successTitle = "النص مع الإيموجي المقترحة";
      copyButtonText = 'نسخ النص مع الإيموجي';
      break;
    case 'poem':
      loadingMessage = 'جاري كتابة القصيدة...';
      errorMessageTitle = 'خطأ في إنشاء القصيدة';
      initialMessageText = "أدخل اسم الشخص وجنسه ولغة القصيدة (وخيار الإيموجي) في الأعلى واضغط على زر إنشاء القصيدة لعرضها هنا.";
      SuccessIconComponent = QuillIcon;
      const nameMatch = originalText.match(/الاسم: ([^,]+)/);
      const languageMatch = originalText.match(/اللغة: ([^,]+)/);
      const emojiMatch = originalText.includes("مع إيموجي");
      let poemTitleParts: string[] = [];
      if (nameMatch) poemTitleParts.push(`لـ ${nameMatch[1].trim()}`);
      if (languageMatch) poemTitleParts.push(`(${languageMatch[1].trim()})`);
      if (emojiMatch) poemTitleParts.push(`مع إيموجي`);
      successTitle = poemTitleParts.length > 0 ? `قصيدة ${poemTitleParts.join(' ')}` : "القصيدة الناتجة";
      copyButtonText = 'نسخ القصيدة';
      break;
  }


  if (isLoading && !error && !processedText) {
    return (
      <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-lg shadow-md text-center" aria-live="polite">
        <LoadingSpinner className="w-8 h-8 text-orange-500 mx-auto mb-2" />
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
    
    // Special handling for unchanged spellcheck title
    if (mode === 'spellcheck' && isUnchangedSpellcheck) {
        successTitle = "النص الأصلي صحيح";
    }

    return (
      <div className={`mt-8 p-6 ${successCardBaseBg} ${successCardBorder} rounded-lg shadow-md`} role="region" aria-labelledby="result-title">
        <div className="flex items-center">
          <SuccessIconComponent className={`w-6 h-6 me-3 flex-shrink-0 ${successIconColor}`} aria-hidden="true" />
          <h3 id="result-title" className={`text-lg font-semibold ${successTitleColor}`}>
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
                    return <span key={index} className="bg-green-100 text-green-700 px-0.5 rounded-sm">{part.value}</span>;
                  }
                  if (part.removed) {
                    return <span key={index} className="bg-red-100 text-red-700 line-through px-0.5 rounded-sm">{part.value}</span>;
                  }
                  return <span key={index}>{part.value}</span>;
                })
              ) : (
                processedText
              )}
            </div>
            {processedText.trim() && ( 
              <button
                onClick={handleCopy}
                disabled={isCopied}
                className={`mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isCopied
                    ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' // Copied state always green
                    : copyButtonBgColor 
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
            )}
          </>
        )}
      </div>
    );
  }
  
  const showInitialMessage = !isLoading && !error && !processedText &&
                             ( (mode === 'spellcheck' || mode === 'roqaa' || mode === 'emoji') ? !originalText.trim() : mode === 'poem' ? true : false );


  if (showInitialMessage) {
     return (
        <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-lg shadow-md text-center">
            <p className="text-slate-500">{initialMessageText}</p>
        </div>
    );
  }

  return null; 
};
