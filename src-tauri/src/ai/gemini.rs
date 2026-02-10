use async_trait::async_trait;
use crate::ai::AIService;
use crate::ai::prompts;
use gemini_rs::Client;

pub struct GeminiProvider {
    api_key: String,
    model_id: String,
}

impl GeminiProvider {
    pub fn new(api_key: String, model_id: String) -> Self {
        Self { api_key, model_id }
    }

    fn clean_json(&self, text: &str) -> String {
        text.replace("```json", "")
            .replace("```", "")
            .trim()
            .to_string()
    }
}

#[async_trait]
impl AIService for GeminiProvider {
    async fn translate(&self, text: &str, target_lang: &str) -> Result<String, String> {
        let prompt = prompts::TRANSLATION_PROMPT
            .replace("{target_lang}", target_lang)
            .replace("{text}", text);
        
        let client = Client::new(self.api_key.clone());
        let response = client.chat(&self.model_id) 
            .send_message(&prompt)
            .await
            .map_err(|e| format!("Gemini API Error: {}", e))?;

        Ok(self.clean_json(&response.to_string()))
    }

    async fn explain(&self, text: &str, insight_lang: &str, hazard_context: Option<&str>) -> Result<String, String> {
        let h_ctx = match hazard_context {
            Some(reason) => format!("IMPORTANT: A cultural risk was detected: {}. Please include a 'Caution' section at the end of your explanation.", reason),
            None => "".to_string(),
        };

        let prompt = prompts::EXPLAINER_PROMPT
            .replace("{text}", text)
            .replace("{lang}", insight_lang)
            .replace("{hazard_context}", &h_ctx);
        
        let client = Client::new(self.api_key.clone());
        let response = client.chat(&self.model_id)
            .send_message(&prompt)
            .await
            .map_err(|e| format!("Gemini API Error: {}", e))?;

        Ok(response.to_string())
    }

    async fn mnemonic(&self, source_text: &str, target_text: &str, insight_lang: &str) -> Result<String, String> {
        let prompt = prompts::MNEMONIC_PROMPT
            .replace("{source_text}", source_text)
            .replace("{target_text}", target_text)
            .replace("{lang}", insight_lang);
        
        let client = Client::new(self.api_key.clone());
        let response = client.chat(&self.model_id)
            .send_message(&prompt)
            .await
            .map_err(|e| format!("Gemini API Error: {}", e))?;

        Ok(response.to_string())
    }
}
