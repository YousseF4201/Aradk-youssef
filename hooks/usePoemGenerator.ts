import { useState, useCallback } from 'react';
import { generatePoemForPerson } from '../services/geminiService';
import type { Gender, PoemLanguage } from '../App';

export const usePoemGenerator = () => {
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [poemLanguage, setPoemLanguage] = useState<PoemLanguage>('msa'); // Default to MSA
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(false); // Default to no emojis
  const [generatedPoem, setGeneratedPoem] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generatePoem = useCallback(async () => {
    if (!name.trim()) {
      setError("الرجاء إدخال اسم الشخص.");
      setGeneratedPoem('');
      return;
    }
    if (!gender) {
      setError("الرجاء تحديد جنس الشخص.");
      setGeneratedPoem('');
      return;
    }
    if (!poemLanguage) {
        setError("الرجاء تحديد لغة القصيدة.");
        setGeneratedPoem('');
        return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generatePoemForPerson(name, gender, poemLanguage, includeEmojis);
      setGeneratedPoem(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("حدث خطأ غير متوقع أثناء إنشاء القصيدة.");
      }
      setGeneratedPoem(''); 
    } finally {
      setIsLoading(false);
    }
  }, [name, gender, poemLanguage, includeEmojis]);

  return {
    name,
    setName,
    gender,
    setGender,
    poemLanguage,
    setPoemLanguage,
    includeEmojis,
    setIncludeEmojis,
    generatedPoem,
    setGeneratedPoem,
    isLoading,
    error,
    setError,
    generatePoem,
  };
};
