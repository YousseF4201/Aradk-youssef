import { GoogleGenAI } from "@google/genai";
import type { PoemLanguage, Gender } from '../App'; // Import PoemLanguage

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error(
    "API_KEY for Gemini is not set in environment variables. Text processing will not work."
  );
}

const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

const handleError = (error: unknown): string => {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key not valid")) {
        return "مفتاح API المستخدم غير صالح. يرجى التحقق من تهيئة مفتاح API الخاص بك.";
      }
      if (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("rate limit")) {
        return "لقد تجاوزت حصتك أو حد المعدل لواجهة برمجة تطبيقات Gemini. يرجى المحاولة مرة أخرى لاحقًا.";
      }
      return `حدث خطأ أثناء الاتصال بـ Gemini API: ${error.message}`;
    }
    return "حدث خطأ غير متوقع أثناء الاتصال بخدمة Gemini.";
};

export const correctSpellingArabic = async (text: string): Promise<string> => {
  if (!ai) {
    throw new Error(
      "لم يتم تكوين Gemini API بشكل صحيح. يرجى التحقق من مفتاح API."
    );
  }

  if (!text.trim()) {
    return ""; 
  }

  try {
    const prompt = `مهمتك هي أن تكون مدققًا لغويًا خبيرًا للغة العربية. قم بمراجعة النص التالي وتصحيح جميع الأخطاء الإملائية والنحوية وعلامات الترقيم. إذا كانت هناك جمل غير واضحة أو تفتقر إلى سلاسة الصياغة، قم بتحسينها مع الحفاظ التام على المعنى الأصلي وأسلوب الكاتب.
يجب أن يكون الناتج هو النص العربي المصحح بالكامل فقط. لا تقم بإضافة أي مقدمات، أو ملاحظات، أو شروحات، أو تعليقات، أو تنسيق markdown.
إذا كان النص الأصلي صحيحًا تمامًا ولا يحتاج إلى أي تعديل، فأعد النص الأصلي كما هو بالضبط.

النص المطلوب تصحيحه:
${text}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const convertToRoqaaArabic = async (text: string): Promise<string> => {
  if (!ai) {
    throw new Error(
      "لم يتم تكوين Gemini API بشكل صحيح. يرجى التحقق من مفتاح API."
    );
  }

  if (!text.trim()) {
    return "";
  }

  try {
    const prompt = `قم بتحويل النص العربي التالي إلى أسلوب الكتابة بخط الرقعة. يجب أن يكون الناتج هو النص المحول فقط. لا تقم بإضافة أي مقدمات، أو ملاحظات، أو شروحات، أو تعليقات، أو تنسيق markdown. إذا لم يكن التحويل ممكنًا بشكل جيد، أو كان النص المدخل غير عربي، أو كان النص فارغًا، فأعد النص الأصلي كما هو أو نصًا فارغًا إذا كان الإدخال فارغًا.

النص المطلوب تحويله:
${text}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
     throw new Error(handleError(error));
  }
};

export const suggestEmojisForText = async (text: string): Promise<string> => {
  if (!ai) {
    throw new Error(
      "لم يتم تكوين Gemini API بشكل صحيح. يرجى التحقق من مفتاح API."
    );
  }

  if (!text.trim()) {
    return "";
  }

  try {
    const prompt = `مهمتك هي إضافة لمسة تعبيرية إلى النص العربي التالي عن طريق اقتراح ودمج إيموجي (رموز تعبيرية) مناسبة بشكل طبيعي داخل النص أو في نهاية الجمل/العبارات ذات الصلة. يجب أن تكون الإيموجي المقترحة ذات صلة بالسياق وتعزز معنى النص أو الشعور الذي يعبر عنه. لا تبالغ في استخدام الإيموجي. إذا كان النص قصيراً جداً أو لا يمكن اقتراح إيموجي مناسب له، يمكنك إعادة النص الأصلي كما هو.
يجب أن يكون الناتج هو النص الأصلي مع الإيموجي المقترحة مدمجة فيه. لا تقم بإضافة أي مقدمات، أو ملاحظات، أو شروحات، أو تعليقات، أو تنسيق markdown.

النص:
${text}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
     throw new Error(handleError(error));
  }
};

export const generatePoemForPerson = async (
  name: string, 
  gender: Gender, 
  poemLanguage: PoemLanguage, 
  includeEmojis: boolean
): Promise<string> => {
  if (!ai) {
    throw new Error(
      "لم يتم تكوين Gemini API بشكل صحيح. يرجى التحقق من مفتاح API."
    );
  }

  if (!name.trim()) {
    return "";
  }

  try {
    const genderArabic = gender === 'male' ? 'رجل' : 'امرأة';
    const languageInstruction = poemLanguage === 'egyptian' 
      ? 'القصيدة يجب أن تكون باللهجة المصرية العامية، بأسلوب حديث وواضح وسلس.'
      : 'القصيدة يجب أن تكون باللغة العربية الفصحى، بأسلوب راقٍ وجميل.';
    
    const emojiInstruction = includeEmojis
      ? 'قم بدمج إيموجي (رموز تعبيرية) مناسبة بشكل طبيعي وجميل داخل أبيات القصيدة أو في نهاياتها لتعزيز المعنى أو الشعور. يجب أن تكون الإيموجي ذات صلة بالسياق وتضيف لمسة فنية رقيقة دون مبالغة.'
      : '';

    const prompt = `اكتب قصيدة جميلة ومناسبة للشخص المسمى "${name}". هذا الشخص هو ${genderArabic}.
${languageInstruction}
القصيدة يجب أن تكون إيجابية وراقية، ويمكن أن تكون في شكل مدح أو تمنيات طيبة أو وصف لصفات حميدة قد ترتبط بالاسم أو بالجنس المذكور بشكل عام.
تجنب تكرار اسم الشخص بشكل مبالغ فيه داخل القصيدة، يكفي ذكره مرة أو مرتين بشكل طبيعي.
${emojiInstruction}
الناتج يجب أن يكون القصيدة فقط، بدون أي مقدمات أو عناوين خارجية أو تعليقات أو تنسيق markdown.

الاسم: ${name}
الجنس: ${genderArabic}
اللغة المطلوبة: ${poemLanguage === 'egyptian' ? 'العامية المصرية' : 'العربية الفصحى'}
${includeEmojis ? 'مع تضمين إيموجي' : 'بدون إيموجي'}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
     throw new Error(handleError(error));
  }
};
