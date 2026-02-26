from typing import Dict, Any

def test():
    payload: Dict[str, Any] = {"transcript": "hello"}
    transcript = payload.get("transcript")
    if isinstance(transcript, str):
        full_text = transcript[:30000]
        return full_text
