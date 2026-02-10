mod global_shortcut;
mod commands;
mod ai;
mod store;
mod clipboard;
mod tray;

use commands::{data_commands, ai_commands, window_commands};
use tauri::WindowEvent;

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
                    if *focused {
                        // Reset dragging flag when focus returns
                        window_commands::set_dragging(false);
                    } else {
                        // Hide window when it loses focus (Ghost behavior)
                        // UNLESS it's sticky OR currently being dragged
                        if !window_commands::is_window_sticky() && !window_commands::is_window_dragging() {
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.hide();
                            }
                        }
                    }
                }
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
            tray::init(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            data_commands::grab_selection,
            ai_commands::translate_text,
            ai_commands::explain_text,
            store::deduct_focus_points,
            store::get_focus_balance,
            store::debug_recharge_focus,
            store::get_target_lang,
            store::save_target_lang,
            window_commands::hide_window,
            window_commands::toggle_sticky,
            window_commands::start_drag
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}