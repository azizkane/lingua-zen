use async_trait::async_trait;

pub mod gemini;
pub mod openrouter;
pub mod prompts;
pub mod models;

#[async_trait]
pub trait AIService {
    async fn translate(&self, text: &str, target_lang: &str) -> Result<String, String>;
    async fn explain(&self, text: &str, insight_lang: &str, hazard_context: Option<&str>) -> Result<String, String>;
    async fn mnemonic(&self, source_text: &str, target_text: &str, insight_lang: &str) -> Result<String, String>;
}
