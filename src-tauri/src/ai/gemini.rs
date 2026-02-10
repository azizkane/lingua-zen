use async_trait::async_trait;
use crate::ai::AIService;
use crate::ai::prompts; // Explicit import
use gemini_rs::Client;

pub struct GeminiProvider {
    api_key: String,
}

impl GeminiProvider {
    pub fn new(api_key: String) -> Self {
        Self { api_key }
    }
}

#[async_trait]
impl AIService for GeminiProvider {
    async fn translate(&self, text: &str, target_lang: &str) -> Result<String, String> {
        let prompt = prompts::TRANSLATION_PROMPT
            .replace("{target_lang}", target_lang)
            .replace("{text}", text);
        
        let client = Client::new(self.api_key.clone());
        
        let response = client.chat("gemini-2.0-flash") 
            .send_message(&prompt)
            .await
            .map_err(|e| format!("Gemini API Error: {}", e))?;

        let result_text = response.to_string();

        if result_text.is_empty() {
            return Err("Received empty response from Gemini".to_string());
        }

        Ok(result_text)
    }

    async fn explain(&self, text: &str) -> Result<String, String> {
        let prompt = prompts::EXPLAINER_PROMPT.replace("{text}", text);
        
        let client = Client::new(self.api_key.clone());
        
        let response = client.chat("gemini-2.0-flash")
            .send_message(&prompt)
            .await
            .map_err(|e| format!("Gemini API Error: {}", e))?;

        let result_text = response.to_string();

        if result_text.is_empty() {
            return Err("Received empty explanation from Gemini".to_string());
        }

        Ok(result_text)
    }
}