from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter
import re
from typing import Dict, Any, Optional

app = FastAPI()

# Allow CORS for local development (Vercel handles it in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_video_id(url: str) -> Optional[str]:
    """Extracts the YouTube video ID from various URL formats."""
    # Matches youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, etc.
    pattern = r'(?:v=|\/|youtu\.be\/)([^"&?\/\s]{11})'
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    return None

@app.get("/api/transcript")
async def get_transcript(url: str = Query(..., description="The YouTube video URL")):
    if not url:
        raise HTTPException(status_code=400, detail="Missing URL parameter")

    video_id = extract_video_id(url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL format")

    try:
        # Fetch the transcript
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Format for frontend consumption (matching TranscriptItem interface)
        formatted_transcript = []
        for i, snippet in enumerate(transcript_list):
            formatted_transcript.append({
                "id": f"t_{i}",
                # Convert seconds to generic timestamp HH:MM:SS or MM:SS
                "timestamp": format_duration(snippet['start']),
                "text": snippet['text']
            })
            
        # For Phase 4, we also need to mock or scrape the VideoData. 
        # Without setting up a full YouTube Data API Key, we will return generic metadata
        # to ensure the frontend doesn't break, mapping specifically what's required.
        mock_video_data = {
            "videoId": video_id,
            "title": f"YouTube Video ({video_id})",
            "channelName": "YouTube Channel",
            "thumbnailUrl": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            "durationInSeconds": int(transcript_list[-1]['start'] + transcript_list[-1]['duration']) if transcript_list else 1200
        }

        return {
            "videoData": mock_video_data,
            "transcript": formatted_transcript
        }

    except Exception as e:
        error_msg = str(e)
        if "TranscriptsDisabled" in error_msg:
            raise HTTPException(status_code=400, detail="Transcripts are disabled for this video.")
        elif "NoTranscriptAvailable" in error_msg:
            raise HTTPException(status_code=400, detail="No transcript available for this video.")
        elif "VideoUnavailable" in error_msg:
            raise HTTPException(status_code=400, detail="Video is unavailable.")
        elif "Bot" in error_msg or "Consent" in error_msg or "Sign in" in error_msg:
             raise HTTPException(status_code=400, detail="YouTube is restricting access. The video might be private or blocking bots.")
        else:
            # Generic catch-all for unknown library errors
            raise HTTPException(status_code=500, detail=f"Failed to extract transcript: {error_msg}")

def format_duration(seconds: float) -> str:
    """Helper to convert float seconds into HH:MM:SS format"""
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"
