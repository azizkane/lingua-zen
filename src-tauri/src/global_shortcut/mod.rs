use tauri::{AppHandle, Manager, Emitter};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, Modifiers, Code, ShortcutState, ShortcutEvent};
use tauri_plugin_clipboard_manager::ClipboardExt;
use enigo::{Enigo, Key, Keyboard, Settings, Direction::{Press, Click, Release}};
use std::{thread, time::Duration};

pub fn init(app: &AppHandle) -> Result<(), String> {
    let summon_shortcut = Shortcut::new(Some(Modifiers::ALT | Modifiers::SHIFT), Code::KeyZ);

    let _ = app.global_shortcut().unregister_all();

    app.global_shortcut().on_shortcut(summon_shortcut, move |app, shortcut, event: ShortcutEvent| {
        if matches!(event.state(), ShortcutState::Pressed) && shortcut == &summon_shortcut {
            let app_handle = app.clone();
            
            thread::spawn(move || {
                let mut enigo = Enigo::new(&Settings::default()).unwrap();

                // 1. FORCE RELEASE MODIFIERS to prevent conflict
                // Even if user is holding them physically, we tell OS they are up.
                let _ = enigo.key(Key::Alt, Release);
                let _ = enigo.key(Key::Shift, Release);
                
                // Tiny sleep to let OS process the release events
                thread::sleep(Duration::from_millis(20));

                // 2. CLEAR CLIPBOARD
                let _ = app_handle.clipboard().write_text("");
                thread::sleep(Duration::from_millis(10));

                // 3. FAST COPY SEQUENCE
                #[cfg(target_os = "macos")]
                {
                    let _ = enigo.key(Key::Command, Press);
                    let _ = enigo.key(Key::Unicode('c'), Click);
                    let _ = enigo.key(Key::Command, Release);
                }
                
                #[cfg(not(target_os = "macos"))]
                {
                    let _ = enigo.key(Key::Control, Press);
                    let _ = enigo.key(Key::Unicode('c'), Click);
                    let _ = enigo.key(Key::Control, Release);
                }

                // 4. SMART POLL (Fast check)
                for _ in 0..20 { // Check 20 times with 10ms delay (max 200ms)
                    thread::sleep(Duration::from_millis(10));
                    if let Ok(text) = app_handle.clipboard().read_text() {
                        if !text.is_empty() {
                            break; 
                        }
                    }
                }

                // 5. SHOW WINDOW IMMEDIATELY
                if let Some(window) = app_handle.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                    let _ = window.emit("ghost-shown", ());
                }
            });
        }
    }).map_err(|e| e.to_string())?;

    Ok(())
}