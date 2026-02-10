use tauri::WebviewWindow;
use std::sync::atomic::{AtomicBool, Ordering};
use once_cell::sync::Lazy;

// Global state for window behaviors
static IS_STICKY: Lazy<AtomicBool> = Lazy::new(|| AtomicBool::new(false));
static IS_DRAGGING: Lazy<AtomicBool> = Lazy::new(|| AtomicBool::new(false));

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