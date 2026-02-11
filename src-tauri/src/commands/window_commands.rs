use tauri::{WebviewWindow, AppHandle, Manager};
use tauri_plugin_opener::OpenerExt;
use std::sync::atomic::{AtomicBool, Ordering};
use once_cell::sync::Lazy;
use std::env;
use dotenvy::dotenv;

// Global state for window behaviors
static IS_STICKY: Lazy<AtomicBool> = Lazy::new(|| AtomicBool::new(false));
static IS_DRAGGING: Lazy<AtomicBool> = Lazy::new(|| AtomicBool::new(false));

#[tauri::command]
pub async fn open_settings(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("settings") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn hide_window(window: WebviewWindow) -> Result<(), String> {
    IS_STICKY.store(false, Ordering::SeqCst);
    IS_DRAGGING.store(false, Ordering::SeqCst);
    window.hide().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn toggle_sticky() -> Result<bool, String> {
    let current = IS_STICKY.load(Ordering::SeqCst);
    let new_state = !current;
    IS_STICKY.store(new_state, Ordering::SeqCst);
    Ok(new_state)
}

pub fn is_window_sticky() -> bool {
    IS_STICKY.load(Ordering::SeqCst)
}

pub fn is_window_dragging() -> bool {
    IS_DRAGGING.load(Ordering::SeqCst)
}

pub fn set_dragging(state: bool) {
    IS_DRAGGING.store(state, Ordering::SeqCst);
}

#[tauri::command]
pub async fn start_drag(window: WebviewWindow) -> Result<(), String> {
    set_dragging(true);
    window.start_dragging().map_err(|e| {
        set_dragging(false);
        e.to_string()
    })?;
    Ok(())
}

#[tauri::command]
pub async fn open_checkout(app: AppHandle) -> Result<(), String> {
    // Explicitly load .env to ensure the variable is accessible
    dotenv().ok();
    
    let checkout_url = env::var("STRIPE_PRO_PAYMENT_LINK")
        .map_err(|_| "STRIPE_PRO_PAYMENT_LINK not set in .env. Please check your configuration.".to_string())?;

    println!("INFO: Opening checkout URL: {}", checkout_url);

    app.opener()
        .open_url(&checkout_url, None::<&str>)
        .map_err(|e| format!("Failed to open browser: {}", e))?;
    Ok(())
}