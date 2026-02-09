mod global_shortcut;
mod commands;
mod ai;
mod store;
mod clipboard;

use commands::{data_commands, ai_commands, window_commands};
use tauri::WindowEvent;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let ai_state = ai_commands::init_ai();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(ai_state)
        .on_window_event(|window, event| {
            match event {
                WindowEvent::Focused(focused) => {
                    if !focused && window.label() == "main" {
                        if window.is_visible().unwrap_or(false) {
                            let _ = window.hide();
                        }
                    }
                }
                // Robust ESC handling at the window level
                WindowEvent::CloseRequested { api, .. } => {
                    let _ = window.hide();
                    api.prevent_close();
                }
                _ => {}
            }
        })
        .setup(|app| {
            global_shortcut::init(app.handle())?;
            clipboard::init(app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet, 
            data_commands::grab_selection,
            ai_commands::translate_text,
            store::deduct_focus_points,
            store::get_focus_balance,
            window_commands::hide_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
