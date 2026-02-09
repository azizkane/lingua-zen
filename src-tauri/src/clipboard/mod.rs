use tauri::{AppHandle, Emitter};
use tauri_plugin_clipboard_manager::ClipboardExt;
use std::{thread, time::Duration};

pub fn init(app: AppHandle) {
    thread::spawn(move || {
        let mut last_clipboard_text = String::new();
        
        loop {
            if let Ok(current_text) = app.clipboard().read_text() {
                if !current_text.is_empty() && current_text != last_clipboard_text {
                    last_clipboard_text = current_text;
                    let _ = app.emit("zen-pulse", ());
                }
            }
            thread::sleep(Duration::from_millis(500));
        }
    });
}
