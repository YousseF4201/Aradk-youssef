import { useState, useCallback } from 'react';
import { correctSpellingArabic, convertToRoqaaArabic, suggestEmojisForText } from '../services/geminiService';
import type { ProcessingMode } from '../App'; // Will need adjustment if ProcessingMode is extended

export const useTextProcessor = () => {
  const [inputText, setInputText] = useState<string>('');
  const [processedText, setProcessedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processInputText = useCallback(async (mode: 'spellcheck' | 'roqaa' | 'emoji') => {
    if (!inputText.trim()) {
      let errorMessage = "الرجاء إدخال نص للمعالجة.";
      if (mode === 'spellcheck') errorMessage = "الرجاء إدخال نص للتدقيق.";
      else if (mode === 'roqaa') errorMessage = "الرجاء إدخال نص للتحويل إلى الرقعة.";
      else if (mode === 'emoji') errorMessage = "الرجاء إدخال نص لاقتراح الإيموجي.";
      setError(errorMessage);
      setProcessedText('');
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
      let result = '';
      if (mode === 'spellcheck') {
        result = await correctSpellingArabic(inputText);
      } else if (mode === 'roqaa') {
        result = await convertToRoqaaArabic(inputText); 
      } else if (mode === 'emoji') {
        result = await suggestEmojisForText(inputText);
      }
      setProcessedText(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("حدث خطأ غير متوقع أثناء معالجة طلبك.");
      }
      setProcessedText(''); 
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return {
    inputText,
    setInputText,
    processedText,
    isLoading,
    error,
    processInputText,
    setError,
    setProcessedText
  };
};
