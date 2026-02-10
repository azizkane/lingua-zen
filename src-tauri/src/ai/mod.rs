use async_trait::async_trait;

pub mod gemini;
pub mod prompts;

#[async_trait]
pub trait AIService {
    async fn translate(&self, text: &str, target_lang: &str) -> Result<String, String>;
    async fn explain(&self, text: &str) -> Result<String, String>;
}