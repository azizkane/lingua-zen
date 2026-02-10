use async_trait::async_trait;
use crate::ai::{AIService, prompts};
use serde_json::{json, Value};
use reqwest::Client;

pub struct OpenRouterProvider {
    api_key: String,
    model_id: String, 
    client: Client,
}

impl OpenRouterProvider {
    pub fn new(api_key: String, model_id: String) -> Self {
        Self {
            api_key,
            model_id,
            client: Client::new(),
        }
    }

    fn clean_json(&self, text: &str) -> String {
        text.replace("```json", "")
            .replace("```", "")
            .trim()
            .to_string()
    }

    async fn request(&self, prompt: String) -> Result<String, String> {
        let response = self.client.post("https://openrouter.ai/api/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("HTTP-Referer", "https://github.com/aziuk/lingua-zen")
            .header("X-Title", "Lingua Zen")
            .json(&json!({
                "model": self.model_id,
                "messages": [
                    { "role": "user", "content": prompt }
                ]
            }))
            .send()
            .await
            .map_err(|e| format!("Network Error: {}", e))?;

        let status = response.status();
        let body: Value = response.json().await.map_err(|e| format!("JSON Parse Error: {}", e))?;

        if !status.is_success() {
            return Err(format!("OpenRouter Error ({}): {}", status, body["error"]["message"]));
        }

        let content = body["choices"][0]["message"]["content"]
            .as_str()
            .map(|s| s.to_string())
            .ok_or_else(|| "Invalid response format from OpenRouter".to_string())?;

        Ok(content)
    }
}

#[async_trait]
impl AIService for OpenRouterProvider {
    async fn translate(&self, text: &str, target_lang: &str) -> Result<String, String> {
        let prompt = prompts::TRANSLATION_PROMPT
            .replace("{target_lang}", target_lang)
            .replace("{text}", text);
        
        let raw = self.request(prompt).await?;
        Ok(self.clean_json(&raw))
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
        self.request(prompt).await
    }

    async fn mnemonic(&self, source_text: &str, target_text: &str, insight_lang: &str) -> Result<String, String> {
        let prompt = prompts::MNEMONIC_PROMPT
            .replace("{source_text}", source_text)
            .replace("{target_text}", target_text)
            .replace("{lang}", insight_lang);
        
        self.request(prompt).await
    }
}
