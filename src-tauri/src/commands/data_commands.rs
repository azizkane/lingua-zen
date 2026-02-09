use tauri::AppHandle;
use tauri_plugin_clipboard_manager::ClipboardExt;

#[tauri::command]
pub async fn grab_selection(app: AppHandle) -> Result<String, String> {
    // The clipboard has already been populated by the global shortcut thread.
    // If the copy failed (timeout), this will return empty string, which is handled by the frontend.
    match app.clipboard().read_text() {
        Ok(text) => Ok(text),
        Err(e) => Err(format!("Failed to read clipboard: {}", e)),
    }
}