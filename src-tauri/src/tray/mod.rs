use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton},
    AppHandle, Manager, Emitter,
};

pub fn init(app: &AppHandle) -> Result<(), tauri::Error> {
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let settings_i = MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?;
    let summon_i = MenuItem::with_id(app, "summon", "Show/Hide Lingua-Zen", true, None::<&str>)?;
    let history_i = MenuItem::with_id(app, "history", "History (Coming Soon)", false, None::<&str>)?;

    let menu = Menu::with_items(
        app,
        &[
            &summon_i,
            &settings_i,
            &history_i,
            &PredefinedMenuItem::separator(app)?,
            &quit_i,
        ],
    )?;

    let _ = TrayIconBuilder::with_id("main-tray")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(move |app, event| {
            match event.id.as_ref() {
                "quit" => {
                    // Graceful-ish shutdown: hide all windows first
                    for window in app.webview_windows().values() {
                        let _ = window.hide();
                    }
                    app.exit(0);
                }
                "settings" => {
                    if let Some(window) = app.get_webview_window("settings") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                "summon" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let is_visible = window.is_visible().unwrap_or(false);
                        if is_visible {
                            let _ = window.hide();
                        } else {
                            let _ = window.show();
                            let _ = window.set_focus();
                            let _ = window.emit("ghost-shown", ());
                        }
                    }
                }
                _ => {}
            }
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let is_visible = window.is_visible().unwrap_or(false);
                    if is_visible {
                        let _ = window.hide();
                    } else {
                        let _ = window.show();
                        let _ = window.set_focus();
                        let _ = window.emit("ghost-shown", ());
                    }
                }
            }
        })
        .icon(app.default_window_icon().unwrap().clone())
        .build(app)?;

    Ok(())
}
