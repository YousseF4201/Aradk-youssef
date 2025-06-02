import React, { useState } from 'react';
import { TextProcessorForm } from './components/TextProcessorForm';
import { ProcessedResultDisplay } from './components/ProcessedResultDisplay';
import { PoemGeneratorForm } from './components/PoemGeneratorForm';
import { useTextProcessor } from './hooks/useTextProcessor';
import { usePoemGenerator } from './hooks/usePoemGenerator';
import { MagicWandIcon } from './components/icons/MagicWandIcon';
import { FontIcon } from './components/icons/FontIcon';
import { SmileyIcon } from './components/icons/SmileyIcon';
import { QuillIcon } from './components/icons/QuillIcon';

export type ProcessingMode = 'spellcheck' | 'roqaa' | 'emoji' | 'poem';
export type Gender = 'male' | 'female';
export type PoemLanguage = 'msa' | 'egyptian'; // msa for Modern Standard Arabic (Fusha)

const App: React.FC = () => {
  const [mode, setMode] = useState<ProcessingMode>('spellcheck');

  const textProcessor = useTextProcessor();
  const poemGenerator = usePoemGenerator();

  const handleModeChange = (newMode: ProcessingMode) => {
    setMode(newMode);
    // Reset states for text processor
    textProcessor.setInputText('');
    textProcessor.setProcessedText('');
    textProcessor.setError(null);
    // Reset states for poem generator
    poemGenerator.setName('');
    poemGenerator.setGender(undefined);
    poemGenerator.setPoemLanguage('msa'); // Default to MSA
    poemGenerator.setIncludeEmojis(false); // Default to no emojis
    poemGenerator.setGeneratedPoem('');
    poemGenerator.setError(null);
  };

  const getHeaderIcon = () => {
    const iconClass = "w-14 h-14 text-orange-500 mx-auto mb-4";
    switch (mode) {
      case 'spellcheck':
        return <MagicWandIcon className={iconClass} />;
      case 'roqaa':
        return <FontIcon className={iconClass} />;
      case 'emoji':
        return <SmileyIcon className={iconClass} />;
      case 'poem':
        return <QuillIcon className={iconClass} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'spellcheck':
        return 'مدقق إملائي عربي';
      case 'roqaa':
        return 'تحويل إلى خط الرقعة';
      case 'emoji':
        return 'اقتراح إيموجي للنص';
      case 'poem':
        return 'إنشاء قصيدة بالذكاء الاصطناعي';
      default:
        return '';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'spellcheck':
        return 'استخدم قوة الذكاء الاصطناعي لتصحيح نصوصك العربية بدقة وسرعة.';
      case 'roqaa':
        return 'حوّل نصوصك العربية إلى أسلوب خط الرقعة بسهولة.';
      case 'emoji':
        return 'احصل على اقتراحات إيموجي مناسبة لإضافة لمسة تعبيرية لنصك العربي.';
      case 'poem':
        return 'أنشئ قصائد شعرية فريدة باللغة العربية (فصحى أو مصرية) بناءً على اسم الشخص وجنسه، مع خيار إضافة الإيموجي.';
      default:
        return '';
    }
  };
  
  let displayIsLoading: boolean = false;
  let displayError: string | null = null;
  let displayResultText: string = '';
  let displayOriginalText: string = ''; 

  if (mode === 'spellcheck' || mode === 'roqaa' || mode === 'emoji') {
    displayIsLoading = textProcessor.isLoading;
    displayError = textProcessor.error;
    displayResultText = textProcessor.processedText;
    displayOriginalText = textProcessor.inputText;
  } else if (mode === 'poem') {
    displayIsLoading = poemGenerator.isLoading;
    displayError = poemGenerator.error;
    displayResultText = poemGenerator.generatedPoem;
    
    let poemContextParts: string[] = [];
    if (poemGenerator.name) poemContextParts.push(`الاسم: ${poemGenerator.name}`);
    if (poemGenerator.gender) poemContextParts.push(`الجنس: ${poemGenerator.gender === 'male' ? 'ذكر' : 'أنثى'}`);
    if (poemGenerator.poemLanguage) poemContextParts.push(`اللغة: ${poemGenerator.poemLanguage === 'msa' ? 'الفصحى' : 'المصرية'}`);
    if (poemGenerator.includeEmojis) poemContextParts.push('مع إيموجي');
    displayOriginalText = poemContextParts.join(', ');
  }


  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
      <header className="mb-8 text-center">
        {getHeaderIcon()}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
          {getTitle()}
        </h1>
        <p className="text-lg text-slate-600 mt-2 max-w-xl mx-auto">
          {getDescription()}
        </p>
      </header>

      <div className="w-full max-w-xl mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
          {[
            { id: 'spellcheck', label: 'تدقيق إملائي' },
            { id: 'roqaa', label: 'تحويل إلى الرقعة' },
            { id: 'emoji', label: 'اقتراح إيموجي' },
            { id: 'poem', label: 'إنشاء قصيدة' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleModeChange(item.id as ProcessingMode)}
              className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75
                ${mode === item.id ? 'bg-orange-500 text-white shadow-lg transform scale-105' : 'bg-slate-200 text-slate-700 hover:bg-orange-100 hover:text-orange-700 border border-slate-300'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-slate-200">
        {(mode === 'spellcheck' || mode === 'roqaa' || mode === 'emoji') && (
          <TextProcessorForm
            inputText={textProcessor.inputText}
            onInputChange={(text) => {
              textProcessor.setInputText(text);
              if (textProcessor.error) textProcessor.setError(null);
            }}
            onSubmit={() => textProcessor.processInputText(mode as 'spellcheck' | 'roqaa' | 'emoji')}
            isLoading={textProcessor.isLoading}
            mode={mode as 'spellcheck' | 'roqaa' | 'emoji'}
          />
        )}
        {mode === 'poem' && (
          <PoemGeneratorForm
            name={poemGenerator.name}
            onNameChange={(name) => {
              poemGenerator.setName(name);
              if (poemGenerator.error) poemGenerator.setError(null);
            }}
            gender={poemGenerator.gender}
            onGenderChange={poemGenerator.setGender}
            poemLanguage={poemGenerator.poemLanguage}
            onPoemLanguageChange={poemGenerator.setPoemLanguage}
            includeEmojis={poemGenerator.includeEmojis}
            onIncludeEmojisChange={poemGenerator.setIncludeEmojis}
            onSubmit={poemGenerator.generatePoem}
            isLoading={poemGenerator.isLoading}
          />
        )}
        <ProcessedResultDisplay
          processedText={displayResultText}
          isLoading={displayIsLoading}
          error={displayError}
          originalText={displayOriginalText} 
          mode={mode}
        />
      </main>

      <footer className="mt-12 text-center text-sm text-slate-500 border-t border-slate-300 pt-10 w-full max-w-2xl">
        <p>مدعوم بواسطة Gemini API</p>
        <p>&copy; {new Date().getFullYear()} معالج النصوص العربي. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default App;
