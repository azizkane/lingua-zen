use tauri::{AppHandle, Emitter};
use tauri_plugin_store::StoreExt;
use serde_json::json;

const STORE_PATH: &str = "zen_focus.json";
const FOCUS_KEY: &str = "focus_balance";
const LANG_KEY: &str = "target_lang";
const INSIGHT_LANG_KEY: &str = "insight_lang"; // New key
const MODEL_KEY: &str = "active_model";

const DEFAULT_BALANCE: u32 = 10;
const DEFAULT_LANG: &str = "French";
const DEFAULT_INSIGHT_LANG: &str = "English";
const DEFAULT_MODEL: &str = "google/gemini-2.0-flash-001";

pub fn get_balance(app: &AppHandle) -> u32 {
    let store = app.store(STORE_PATH).expect("Failed to open store");
    store.get(FOCUS_KEY)
        .and_then(|v| v.as_u64())
        .map(|v| v as u32)
        .unwrap_or(DEFAULT_BALANCE)
}

#[tauri::command]
pub async fn deduct_focus_points(app: AppHandle, amount: u32) -> Result<u32, String> {
    let current = get_balance(&app);
    if current < amount {
        return Err("Insufficient Zen Focus points".to_string());
    }

    let new_balance = current - amount;
    
    {
        let store = app.store(STORE_PATH).expect("Failed to open store");
        store.set(FOCUS_KEY, json!(new_balance));
        let _ = store.save();
    }

    let _ = app.emit("focus-update", new_balance);
    Ok(new_balance)
}

#[tauri::command]
pub async fn get_focus_balance(app: AppHandle) -> Result<u32, String> {
    Ok(get_balance(&app))
}

// =============================================================================
// SETTINGS COMMANDS
// =============================================================================

#[tauri::command]
pub async fn get_target_lang(app: AppHandle) -> Result<String, String> {
    let store = app.store(STORE_PATH).expect("Failed to open store");
    let lang = store.get(LANG_KEY)
        .and_then(|v| v.as_str().map(|s| s.to_string()))
        .unwrap_or_else(|| DEFAULT_LANG.to_string());
    Ok(lang)
}

#[tauri::command]
pub async fn save_target_lang(app: AppHandle, lang: String) -> Result<(), String> {
    {
        let store = app.store(STORE_PATH).expect("Failed to open store");
        store.set(LANG_KEY, json!(lang));
        let _ = store.save();
    }
    let _ = app.emit("settings-update", lang);
    Ok(())
}

#[tauri::command]
pub async fn get_insight_lang(app: AppHandle) -> Result<String, String> {
    let store = app.store(STORE_PATH).expect("Failed to open store");
    let lang = store.get(INSIGHT_LANG_KEY)
        .and_then(|v| v.as_str().map(|s| s.to_string()))
        .unwrap_or_else(|| DEFAULT_INSIGHT_LANG.to_string());
    Ok(lang)
}

#[tauri::command]
pub async fn save_insight_lang(app: AppHandle, lang: String) -> Result<(), String> {
    {
        let store = app.store(STORE_PATH).expect("Failed to open store");
        store.set(INSIGHT_LANG_KEY, json!(lang));
        let _ = store.save();
    }
    let _ = app.emit("insight-lang-update", lang);
    Ok(())
}

#[tauri::command]
pub async fn get_active_model(app: AppHandle) -> Result<String, String> {
    let store = app.store(STORE_PATH).expect("Failed to open store");
    let model = store.get(MODEL_KEY)
        .and_then(|v| v.as_str().map(|s| s.to_string()))
        .unwrap_or_else(|| DEFAULT_MODEL.to_string());
    Ok(model)
}

#[tauri::command]
pub async fn save_active_model(app: AppHandle, model: String) -> Result<(), String> {
    {
        let store = app.store(STORE_PATH).expect("Failed to open store");
        store.set(MODEL_KEY, json!(model));
        let _ = store.save();
    }
    let _ = app.emit("model-update", model);
    Ok(())
}

// =============================================================================
// TEST MODE COMMANDS
// =============================================================================

#[tauri::command]
pub async fn debug_recharge_focus(app: AppHandle) -> Result<u32, String> {
    let current = get_balance(&app);
    let new_balance = current + 100;
    
    {
        let store = app.store(STORE_PATH).expect("Failed to open store");
        store.set(FOCUS_KEY, json!(new_balance));
        let _ = store.save();
    }

    let _ = app.emit("focus-update", new_balance);
    Ok(new_balance)
}