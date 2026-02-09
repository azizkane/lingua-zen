use async_trait::async_trait;
use crate::ai::AIService;
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
        let prompt = format!("Translate the following text to {}: \n\n{}", target_lang, text);
        
        let client = Client::new(self.api_key.clone());
        
        // Switched back to 1.5-flash for higher free tier quota
        let response = client.chat("gemini-3-flash-preview")
            .send_message(&prompt)
            .await
            .map_err(|e| format!("Gemini API Error: {}", e))?;

        let result_text = response.to_string();

        if result_text.is_empty() {
            return Err("Received empty response from Gemini".to_string());
        }

        Ok(result_text)
    }

    async fn explain(&self, _text: &str) -> Result<String, String> {
        Ok("Not implemented yet".to_string()) 
    }
}