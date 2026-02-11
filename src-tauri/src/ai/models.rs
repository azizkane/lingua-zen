use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ModelInfo {
    pub id: String,
    pub name: String,
    pub source: String,
    pub description: String,
}

pub fn get_models() -> Vec<ModelInfo> {
    vec![
        ModelInfo { 
            id: "google/gemini-2.0-flash-001".to_string(), 
            name: "Gemini 2.0 Flash".to_string(),
            source: "openrouter".to_string(),
            description: "High-speed, next-generation model. Optimized for rapid responses.".to_string(),
        },
        ModelInfo { 
            id: "gemini-2.0-flash-lite".to_string(), 
            name: "Gemini 2.0 Lite".to_string(),
            source: "openrouter".to_string(),
            description: "Ultra-fast and efficient version of Gemini 2.0.".to_string(),
        },
        ModelInfo { 
            id: "openrouter/aurora-alpha".to_string(), 
            name: "Aurora Alpha".to_string(),
            source: "openrouter".to_string(),
            description: "Specialized model for high-quality linguistic reasoning.".to_string(),
        },
        ModelInfo { 
            id: "anthropic/claude-3.5-sonnet".to_string(), 
            name: "Claude 3.5 Sonnet".to_string(),
            source: "openrouter".to_string(),
            description: "Exceptional for nuanced linguistic transitions and natural phrasing.".to_string(),
        },
        ModelInfo { 
            id: "openai/gpt-4o-mini".to_string(), 
            name: "GPT-4o Mini".to_string(),
            source: "openrouter".to_string(),
            description: "Lightweight and smart. Reliable performance for quick insights.".to_string(),
        },
        ModelInfo { 
            id: "gemini-2.0-flash".to_string(), 
            name: "Gemini 2.0 (Direct)".to_string(),
            source: "gemini".to_string(),
            description: "Native Google API integration. Fastest response time.".to_string(),
        },
    ]
}
