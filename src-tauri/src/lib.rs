mod global_shortcut;
mod commands;
mod ai;
mod store;
mod clipboard;
mod tray;

use commands::{data_commands, ai_commands, window_commands};
use tauri::{WindowEvent, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .on_window_event(|window, event| {
            match event {
                WindowEvent::Focused(focused) => {
                    if *focused {
                        window_commands::set_dragging(false);
                    } else {
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
            // Initialize AI state with persistent model choice
            let ai_state = ai_commands::init_ai(app.handle());
            app.manage(ai_state);

            global_shortcut::init(app.handle())?;
            clipboard::init(app.handle().clone());
            tray::init(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            data_commands::grab_selection,
            ai_commands::translate_text,
            ai_commands::explain_text,
            ai_commands::generate_mnemonic,
            ai_commands::get_available_models,
            ai_commands::refresh_ai_service,
            store::deduct_focus_points,
            store::get_focus_balance,
            store::debug_recharge_focus,
            store::get_target_lang,
            store::save_target_lang,
            store::get_insight_lang,
            store::save_insight_lang,
            store::get_active_model,
            store::save_active_model,
            window_commands::hide_window,
            window_commands::toggle_sticky,
            window_commands::start_drag,
            window_commands::open_checkout
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}