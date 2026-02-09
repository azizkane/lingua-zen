use tauri::{AppHandle, Emitter};
use tauri_plugin_store::StoreExt;
use serde_json::json;

const STORE_PATH: &str = "zen_focus.json";
const FOCUS_KEY: &str = "focus_balance";
const DEFAULT_BALANCE: u32 = 10;

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

    // Notify all windows of the update
    let _ = app.emit("focus-update", new_balance);

    Ok(new_balance)
}

#[tauri::command]
pub async fn get_focus_balance(app: AppHandle) -> Result<u32, String> {
    Ok(get_balance(&app))
}
