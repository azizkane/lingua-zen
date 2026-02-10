use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ModelInfo {
    pub id: String,
    pub name: String,
    pub source: String, // "gemini" or "openrouter"
    pub description: String,
}

pub fn get_models() -> Vec<ModelInfo> {
    vec![
        ModelInfo { 
            id: "openrouter/aurora-alpha".to_string(), 
            name: "Aurora Alpha".to_string(),
            source: "openrouter".to_string(),
            description: "Lightweight and smart. Reliable performance for everyday translations and quick insights.".to_string(),
        },
        ModelInfo { 
            id: "gemini-2.0-flash-lite".to_string(), 
            name: "Gemini 2.0 flash".to_string(),
            source: "gemini".to_string(),
            description: "Native Google API integration. Fastest response time with direct infrastructure access.".to_string(),
        },
    ]
}