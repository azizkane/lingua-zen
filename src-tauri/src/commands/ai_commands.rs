use tauri::State;
use crate::ai::{AIService, gemini::GeminiProvider};
use dotenvy::dotenv;
use std::env;
use std::sync::Arc;

pub struct AIState {
    pub service: Arc<dyn AIService + Send + Sync>,
}

#[tauri::command]
pub async fn translate_text(
    text: String,
    target_lang: String,
    state: State<'_, AIState>,
) -> Result<String, String> {
    println!("DEBUG: Starting translation for text: '{}'", text);
    state.service.translate(&text, &target_lang).await
}

pub fn init_ai() -> AIState {
    dotenv().ok();
    
    let api_key = env::var("GEMINI_API_KEY")
        .or_else(|_| env::var("GOOGLE_GEMINI_API_KEY"))
        .expect("GEMINI_API_KEY or GOOGLE_GEMINI_API_KEY must be set in .env");

    println!("DEBUG: AI initialized with key (first 4 chars): {}...", &api_key[0..4]);

    let provider = GeminiProvider::new(api_key);
    AIState {
        service: Arc::new(provider),
    }
}