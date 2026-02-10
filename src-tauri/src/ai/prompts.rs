pub const TRANSLATION_PROMPT: &str = "You are a professional translator. Translate the following text to {target_lang}. 
Return ONLY the translated text. Do not include any explanations, notes, or original text. 

Text: {text}";

pub const EXPLAINER_PROMPT: &str = "You are a patient and clear teacher. Explain the following concept, term, or text simply and concisely in English. 
Focus on the 'why' and the core meaning. Keep it under 3-4 sentences. 

Concept: {text}";
