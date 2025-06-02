import { useState, useCallback } from 'react';
import { correctSpellingArabic, convertToRoqaaArabic, suggestEmojisForText } from '../services/geminiService';
// The 'ProcessingMode' type will be updated once App.tsx definition changes.
// For now, this hook only knows about its specific modes.
// App.tsx will ensure it's called with the correct mode type.
import type { ProcessingMode as AppProcessingMode } from '../App';


export const useTextProcessor = () => {
  const [inputText, setInputText] = useState<string>('');
  const [processedText, setProcessedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // This function is specifically for text processing modes
  const processInputText = useCallback(async (mode: Extract<AppProcessingMode, 'spellcheck' | 'roqaa' | 'emoji'>) => {
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
