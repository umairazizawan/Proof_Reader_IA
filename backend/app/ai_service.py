from google import genai
import os

# a minimal wrapper for the proofreader call

def proofread_text(text: str) -> str:
    """Send the paragraph to Gemini and return the raw text response."""
    # make sure API key is set in environment
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        # raise a clear error before attempting to contact Gemini
        raise RuntimeError(
            "GEMINI_API_KEY environment variable not set. "
            "Please export a valid key before starting the server."
        )
    client = genai.Client(api_key=api_key)

    model_id = "gemini-2.5-flash-lite"
    prompt = (
        "You are a professional editor. Proofread the following paragraph for grammar,\n"
        "punctuation, and clarity.\n\n"
        "Return your response in exactly this format:\n"
        "REVISED: [The corrected paragraph]\n"
        "CHANGES: [A bulleted list explaining the specific edits made]\n"
        "Theme: [The main theme of the paragraph, in a few words or less if possible]\n"
        "Tips: [Any tips for improving the quality of the writing, such as adding additional context or researching and adding more information.]\n"
        "PARAGRAPH:\n"
        f"{text}"
    )

    response = client.models.generate_content(
        model=model_id,
        contents=prompt,
    )

    return response.text
