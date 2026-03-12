# AI Excuse Generator

An interactive AI-powered Excuse Generator built using Python and Gradio.  
Generate creative excuses, convert them to voice, send them via SMS, and even generate images — all through a simple web interface.

## Features

- **Excuse Generation** — Select scenario type, urgency level, and input context to generate tailored excuses via OpenAI API
- **Text-to-Speech** — Convert generated excuses to audio using ElevenLabs TTS
- **Image Generation** — Generate contextual images from excuses using Stable Diffusion
- **Apology Letter Generator** — Generate a formal apology letter based on the excuse
- **SMS Delivery** — Send excuses directly to any phone number via Twilio
- **Save Favorites** — Save and view your favourite generated excuses
- **Web UI** — Clean, interactive interface built with Gradio

## Tech Stack

| Tool | Purpose |
|------|---------|
| Python 3 | Core language |
| Gradio | Web interface |
| OpenAI API | Excuse text generation |
| GROQ API | Fast inference support |
| ElevenLabs API | Text-to-speech voice generation |
| Stable Diffusion | Image generation from excuse context |
| Twilio API | SMS delivery |

## Working Process

1. User selects **scenario type** and **urgency level**, then inputs context
2. **OpenAI API** generates a tailored, creative excuse
3. User can choose from 4 optional output modes:
   -  Convert excuse to audio via **ElevenLabs TTS**
   -  Generate a contextual image via **Stable Diffusion**
   -  Generate a formal **apology letter**
   -  Send excuse via **Twilio SMS** to a specified number
4. All outputs rendered instantly in the **Gradio web interface**

## How to Run

### Prerequisites
- Python 3.8+
- API keys for: OpenAI, ElevenLabs, Twilio, GROQ, Stable Diffusion

### Steps

```bash
# Clone the repository
git clone https://github.com/akashbhuma/Projects_by_Akash.git

# Navigate to project folder
cd Projects_by_Akash/Excuse_Generator

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

### Environment Variables
Create a `.env` file in the project root and add your API keys:
```
OPENAI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
GROQ_API_KEY=your_key_here
```

## Project Structure

```
Excuse_Generator/
├── app.py                  # Main application file
├── requirements.txt        # Python dependencies
├── .env                    # API keys (not committed)
└── README.md
```

## Author

**Akash Bhuma**  
B.Tech Computer Science Engineering, Mahindra University  
[GitHub](https://github.com/akashbhuma) | [LinkedIn](https://linkedin.com/in/akash-bhuma)
