use async_trait::async_trait;

pub mod gemini;

#[async_trait]
pub trait AIService {
    async fn translate(&self, text: &str, target_lang: &str) -> Result<String, String>;
    #[allow(dead_code)]
    async fn explain(&self, text: &str) -> Result<String, String>;
}