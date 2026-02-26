from fastapi import FastAPI, HTTPException, Header, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, Optional, List
import os
from supabase import create_client, Client
import google.generativeai as genai
import json

app = FastAPI()

# Allow CORS for local development (Vercel handles it in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase Admin Client for RPC calls.
# We use the service role key or anon key to initialize, but we will pass the user's JWT to authenticate the RPC executing as them.
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None

# Initialize Google Gemini
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
# System instructions to strictly govern Gemini's output
PROMPTS = {
    "summary": """
        Act as an Executive Assistant. 
        Analyze the provided YouTube transcript and generate a comprehensive Summary.
        Format the output in clean, readable Markdown. 
        Include:
        - A high-level overview (1-2 paragraphs)
        - Key Takeaways (bulleted list)
        - Detailed breakdown of major sections
        Do not include introductory or conversational filler. Output the Markdown directly.
    """,
    "mindmap": """
        You are an expert data visualizer specializing in Mermaid.js.
        Analyze the provided YouTube transcript and construct a hierarchical mindmap representing the core concepts and their relationships.
        
        CRITICAL CONSTRAINTS:
        - Output ONLY the raw Mermaid.js mindmap syntax.
        - DO NOT wrap the output in markdown code blocks (e.g., no ```mermaid).
        - DO NOT include any conversational filler, explanations, or greeting text.
        - Ensure valid syntax. Top node should be root((Main Topic)).
        - Example format:
        mindmap
          root((Topic))
            Subtopic 1
              Detail A
              Detail B
            Subtopic 2
    """,
    "flowchart": """
        You are an expert data visualizer specializing in Mermaid.js.
        Analyze the provided YouTube transcript and construct a flowchart tracking the logical progression, process, or narrative chronologically.
        
        CRITICAL CONSTRAINTS:
        - Output ONLY the raw Mermaid.js flowchart syntax.
        - DO NOT wrap the output in markdown code blocks (e.g., no ```mermaid).
        - DO NOT include any conversational filler, explanations, or greeting text.
        - Ensure valid syntax starting with `graph TD` or `graph LR`.
        - Example format:
        graph TD
          A[Start here] --> B{Decision}
          B -->|Yes| C[Result 1]
    """
}

async def verify_and_deduct_credit(authorization: Optional[str]) -> bool:
    if not supabase:
        print("Supabase not configured. Skipping credit check.")
        return True # For local testing without backend

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ")[1]

    try:
        # Create a new Supabase client scoped exactly to the parsed user JWT
        # This securely impersonates them so RLS and RPC limits apply
        user_scoped_client = create_client(
            SUPABASE_URL, 
            SUPABASE_KEY,
            options={"global": {"headers": {"Authorization": f"Bearer {token}"}}}
        )
        
        # Call the secure decrement_credit RPC
        # Expecting boolean response indicating success/failure
        response = user_scoped_client.rpc('decrement_credit', {'deduct_amount': 1}).execute()
        
        if response.data is True:
            return True
        else:
            return False

    except Exception as e:
        print(f"Credit Verification Error: {e}")
        return False

@app.post("/api/generate")
async def generate_analysis(
    payload: Dict[str, Any] = Body(...),
    authorization: Optional[str] = Header(None)
):
    transcript = payload.get("transcript")
    format_type = payload.get("format_type")

    if not transcript:
        raise HTTPException(status_code=400, detail="Missing transcript")
    
    if format_type not in PROMPTS:
        raise HTTPException(status_code=400, detail=f"Invalid format_type. Kept to: {list(PROMPTS.keys())}")

    # 1. SECURITY LAYER: Validate token and deduct credit
    has_credits = await verify_and_deduct_credit(authorization)
    if not has_credits:
         raise HTTPException(status_code=402, detail="Payment Required: Insufficient Credits or Unauthorized")

    # 2. AI LAYER: Feed to Gemini
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing on server")

    try:
        # Prepare context
        # We cap the transcript to avoid passing absurdly long string arrays directly, 
        # though Gemini 1.5 is very permissive. Let's merge the text fields.
        full_text = ""
        if isinstance(transcript, list):
             # Extract string safely from dict array
             texts = [str(item.get("text", "")) for item in transcript if isinstance(item, dict)]
             full_text = " ".join(texts)
             full_text = full_text[:30000] # Send up to 30k characters max
        elif isinstance(transcript, str):
             safe_text: str = str(transcript)
             full_text = safe_text[0:30000] # string safety cap

        # Construct generation configuration
        if not format_type or str(format_type) not in PROMPTS:
            raise HTTPException(status_code=400, detail="Invalid format_type")
            
        system_instruction = PROMPTS[str(format_type)]
        
        model = genai.GenerativeModel(
             model_name="gemini-1.5-flash",
             system_instruction=system_instruction
        )

        response = model.generate_content(
            f"Please process the following transcript according to your system instructions:\n\n{full_text}",
            generation_config=genai.types.GenerationConfig(
                temperature=0.2, # Low temperature for accurate syntax formatting
            )
        )
        
        result_text = response.text.strip()
        
        if format_type in ["mindmap", "flowchart"]:
            # Hard strip any residual markdown blocks if model disobeys
            result_text = result_text.replace("```mermaid", "").replace("```", "").strip()

        return {"generated_content": result_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Generation Failed: {str(e)}")
