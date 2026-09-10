from pathlib import Path
import fitz
from docx import Document

def extract_text(filename: str, content: bytes) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix == ".pdf":
        doc = fitz.open(stream=content, filetype="pdf")
        return "\n".join(page.get_text() for page in doc)
    if suffix == ".docx":
        import io
        doc = Document(io.BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)
    if suffix == ".txt":
        return content.decode("utf-8", errors="replace")
    raise ValueError("Supported files: PDF, DOCX and TXT")
