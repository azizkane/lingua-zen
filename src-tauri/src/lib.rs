mod global_shortcut;
mod commands;
mod ai;
mod store;
mod clipboard;
mod tray;

use commands::{data_commands, ai_commands, window_commands};
use tauri::{WindowEvent, Manager, Emitter};
use tauri_plugin_deep_link::DeepLinkExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            println!("DEBUG: Single Instance triggered with args: {:?}", args);
            
            let _ = app.get_webview_window("main")
                .expect("no main window")
                .show();
            let _ = app.get_webview_window("main")
                .expect("no main window")
                .set_focus();
            
            for arg in args {
                // Emit to frontend regardless of content - let frontend handle routing
                let _ = app.emit("deep-link-received", &arg);

                if arg.contains("activate") {
                    println!("SUCCESS: Pro Activation caught: {}", arg);
                    let handle = app.clone();
                    tauri::async_runtime::block_on(async move {
                        let _ = store::save_pro_status(handle, true).await;
                    });
                }
            }
        }))
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
            #[cfg(desktop)]
            let _ = app.deep_link().register("lingua-zen");

            app.deep_link().on_open_url(|event| {
                println!("DEBUG: Deep link event (cold start): {:?}", event.urls());
            });

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
            store::get_pro_active,
            store::save_pro_status,
            window_commands::open_settings,
            window_commands::hide_window,
            window_commands::toggle_sticky,
            window_commands::start_drag,
            window_commands::open_checkout
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
