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
        // Handle cases where models still output markdown despite instructions
        text.replace("```json", "")
            .replace("```", "")
            .trim()
            .to_string()
    }

    async fn request(&self, prompt: String, is_json: bool) -> Result<String, String> {
        let mut body = json!({
            "model": self.model_id,
            "messages": [
                { "role": "user", "content": prompt }
            ]
        });

        // Enforce JSON mode if requested
        if is_json {
            body["response_format"] = json!({ "type": "json_object" });
            if let Some(messages) = body["messages"].as_array_mut() {
                messages.insert(0, json!({
                    "role": "system",
                    "content": "You are a specialized JSON assistant. You only output valid JSON. No preamble, no markdown."
                }));
            }
        }

        let response = self.client.post("https://openrouter.ai/api/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("HTTP-Referer", "https://github.com/aziuk/lingua-zen")
            .header("X-Title", "Lingua Zen")
            .json(&body)
            .send()
            .await
            .map_err(|e| format!("Network Error: {}", e))?;

        let status = response.status();
        let body_val: Value = response.json().await.map_err(|e| format!("JSON Parse Error: {}", e))?;

        if !status.is_success() {
            let err_msg = body_val["error"]["message"].as_str().unwrap_or("Unknown OpenRouter Error");
            return Err(format!("OpenRouter Error ({}): {}", status, err_msg));
        }

        let content = body_val["choices"][0]["message"]["content"]
            .as_str()
            .map(|s| s.to_string())
            .ok_or_else(|| "Invalid response format: Missing message content".to_string())?;

        if is_json {
            Ok(self.clean_json(&content))
        } else {
            Ok(content)
        }
    }
}

#[async_trait]
impl AIService for OpenRouterProvider {
    async fn translate(&self, text: &str, target_lang: &str) -> Result<String, String> {
        let prompt = prompts::TRANSLATION_PROMPT
            .replace("{target_lang}", target_lang)
            .replace("{text}", text);
        
        self.request(prompt, true).await
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
        
        self.request(prompt, false).await
    }

    async fn mnemonic(&self, source_text: &str, target_text: &str, insight_lang: &str) -> Result<String, String> {
        let prompt = prompts::MNEMONIC_PROMPT
            .replace("{source_text}", source_text)
            .replace("{target_text}", target_text)
            .replace("{lang}", insight_lang);
        
        self.request(prompt, false).await
    }
}
