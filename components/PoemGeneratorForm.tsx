import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { QuillIcon } from './icons/QuillIcon';
import type { Gender, PoemLanguage } from '../App';

interface PoemGeneratorFormProps {
  name: string;
  onNameChange: (name: string) => void;
  gender: Gender | undefined;
  onGenderChange: (gender: Gender) => void;
  poemLanguage: PoemLanguage;
  onPoemLanguageChange: (language: PoemLanguage) => void;
  includeEmojis: boolean;
  onIncludeEmojisChange: (include: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PoemGeneratorForm: React.FC<PoemGeneratorFormProps> = ({
  name,
  onNameChange,
  gender,
  onGenderChange,
  poemLanguage,
  onPoemLanguageChange,
  includeEmojis,
  onIncludeEmojisChange,
  onSubmit,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="personName" className="block text-sm font-medium text-slate-700 mb-1">
          اسم الشخص
        </label>
        <input
          type="text"
          id="personName"
          name="personName"
          className="block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors duration-150 ease-in-out placeholder-slate-400"
          placeholder="أدخل اسم الشخص هنا..."
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          dir="rtl"
          disabled={isLoading}
          aria-label="اسم الشخص"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          الجنس
        </label>
        <div className="flex space-x-4 rtl:space-x-reverse">
          {(['male', 'female'] as Gender[]).map((option) => (
            <label key={option} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={option}
                checked={gender === option}
                onChange={() => onGenderChange(option)}
                disabled={isLoading}
                className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-slate-300"
              />
              <span className="text-sm text-slate-700">
                {option === 'male' ? 'ذكر' : 'أنثى'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          لغة القصيدة
        </label>
        <div className="flex space-x-4 rtl:space-x-reverse">
          {(['msa', 'egyptian'] as PoemLanguage[]).map((option) => (
            <label key={option} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
              <input
                type="radio"
                name="poemLanguage"
                value={option}
                checked={poemLanguage === option}
                onChange={() => onPoemLanguageChange(option)}
                disabled={isLoading}
                className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-slate-300"
              />
              <span className="text-sm text-slate-700">
                {option === 'msa' ? 'الفصحى' : 'المصرية'}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
          <input
            type="checkbox"
            name="includeEmojis"
            checked={includeEmojis}
            onChange={(e) => onIncludeEmojisChange(e.target.checked)}
            disabled={isLoading}
            className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-slate-300 rounded"
          />
          <span className="text-sm font-medium text-slate-700">
            إضافة إيموجي للقصيدة
          </span>
        </label>
      </div>


      <button
        type="submit"
        disabled={isLoading || !name.trim() || !gender || !poemLanguage}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
        aria-live="polite"
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="w-5 h-5 me-2" />
            جاري إنشاء القصيدة...
          </>
        ) : (
          <>
            <QuillIcon className="w-5 h-5 me-2" aria-hidden="true" />
            أنشئ القصيدة
          </>
        )}
      </button>
    </form>
  );
};
