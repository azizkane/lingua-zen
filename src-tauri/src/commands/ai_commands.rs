use tauri::{State, AppHandle};
use crate::ai::{AIService, gemini::GeminiProvider, openrouter::OpenRouterProvider, models::{self, ModelInfo}};
use crate::store;
use dotenvy::dotenv;
use std::env;
use std::sync::Arc;
use std::sync::Mutex;

// Use a Mutex-wrapped Arc to allow dynamic provider swapping
pub struct AIState {
    pub service: Mutex<Arc<dyn AIService + Send + Sync>>,
}

#[tauri::command]
pub async fn translate_text(
    text: String,
    target_lang: String,
    state: State<'_, AIState>,
) -> Result<String, String> {
    let service = state.service.lock().unwrap().clone();
    service.translate(&text, &target_lang).await
}

#[tauri::command]
pub async fn explain_text(
    text: String,
    insight_lang: String,
    hazard_context: Option<String>,
    state: State<'_, AIState>,
) -> Result<String, String> {
    let service = state.service.lock().unwrap().clone();
    service.explain(&text, &insight_lang, hazard_context.as_deref()).await
}

#[tauri::command]
pub async fn generate_mnemonic(
    text: String,
    target_text: String,
    insight_lang: String,
    state: State<'_, AIState>,
) -> Result<String, String> {
    let service = state.service.lock().unwrap().clone();
    service.mnemonic(&text, &target_text, &insight_lang).await
}

#[tauri::command]
pub fn get_available_models() -> Vec<ModelInfo> {
    models::get_models()
}

// Helper to create a provider based on ID
fn create_provider(_app: &AppHandle, model_id: &str) -> Arc<dyn AIService + Send + Sync> {
    dotenv().ok();
    let available_models = models::get_models();
    let model_info = available_models.iter()
        .find(|m| m.id == model_id)
        .cloned()
        .unwrap_or_else(|| available_models[0].clone());

    match model_info.source.as_str() {
        "openrouter" => {
            let api_key = env::var("OPENROUTER_API_KEY")
                .expect("OPENROUTER_API_KEY must be set in .env");
            Arc::new(OpenRouterProvider::new(api_key, model_info.id))
        },
        "gemini" => {
            let api_key = env::var("GEMINI_API_KEY")
                .or_else(|_| env::var("GOOGLE_GEMINI_API_KEY"))
                .expect("GEMINI API key must be set in .env");
            Arc::new(GeminiProvider::new(api_key, model_info.id))
        },
        _ => panic!("Unknown source"),
    }
}

pub fn init_ai(app: &AppHandle) -> AIState {
    let active_model_id = tauri::async_runtime::block_on(async {
        store::get_active_model(app.clone()).await.unwrap_or_else(|_| "google/gemini-2.0-flash-001".to_string())
    });

    AIState {
        service: Mutex::new(create_provider(app, &active_model_id)),
    }
}

#[tauri::command]
pub async fn refresh_ai_service(app: AppHandle, state: State<'_, AIState>) -> Result<(), String> {
    let active_model_id = store::get_active_model(app.clone()).await?;
    let new_provider = create_provider(&app, &active_model_id);
    
    let mut service_lock = state.service.lock().unwrap();
    *service_lock = new_provider;
    
    println!("INFO: AI Service Refreshed with model: {}", active_model_id);
    Ok(())
}