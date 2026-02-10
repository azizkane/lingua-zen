pub const TRANSLATION_PROMPT: &str = "You are a professional translator. Translate the following text to {target_lang}. \
Return a valid JSON object ONLY. Do not wrap it in markdown code blocks. \
Structure: { \"translation\": \"string\", \"hazard_level\": \"safe\" | \"low\" | \"medium\" | \"high\", \"hazard_reason\": \"string or null\" } \n\nText: {text}";

pub const EXPLAINER_PROMPT: &str = "You are a patient and clear teacher. Explain the following concept, term, or text simply and concisely in {lang}. \
Focus on the 'why' and the core meaning. Keep it under 3-4 sentences. \
{hazard_context}\n\nConcept: {text}";

pub const MNEMONIC_PROMPT: &str = "Create a short, catchy, and memorable mnemonic to help a {lang} speaker remember the meaning of this text. \
Connect the sound or meaning of the source text to the target translation. Be creative but keep it very brief (1-2 sentences). \n\nSource: {source_text}\nTarget: {target_text}";
