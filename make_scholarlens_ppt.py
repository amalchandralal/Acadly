from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

OUT = r"C:\Users\amalc\OneDrive\Desktop\DjangoProject\ScholarLens_Presentation.pptx"

NAVY = RGBColor(30, 58, 138)
BLUE = RGBColor(37, 99, 235)
INK = RGBColor(15, 23, 42)
MUTED = RGBColor(100, 116, 139)
LIGHT = RGBColor(248, 250, 252)
WHITE = RGBColor(255, 255, 255)
BORDER = RGBColor(226, 232, 240)

slides = [
    ("ScholarLens", ["Academic Research Paper Search & Synthesis Portal", "Django + React Full-Stack Project"]),
    ("Project Objectives", ["Reduce time spent understanding research papers", "Provide structured summaries and BibTeX citations", "Organize papers and reading progress"]),
    ("Problem Statement", ["Scientific abstracts are dense and time-consuming", "Important findings, method, and limitations are hard to scan", "Researchers need one efficient literature workflow"]),
    ("Proposed Solution", ["React 18 frontend for search and research tools", "Django REST APIs for secure application logic", "Live arXiv ingestion with SQLite local storage"]),
    ("System Architecture", ["React / Vite", "Axios + REST APIs", "Django / DRF", "SQLite + arXiv"]),
    ("Technology Stack", ["Backend: Python, Django 6, DRF", "Frontend: React 18, Vite, Axios", "Database: SQLite ORM", "Authentication: DRF tokens"]),
    ("Search & Paper Discovery", ["Search by topic, author, keyword, or arXiv ID", "Live official arXiv API integration", "Local database cache and fallback search"]),
    ("Structured Paper Analysis", ["Executive overview", "Key findings", "Methodology", "Lay summary", "Limitations", "BibTeX citation"]),
    ("Research Collections", ["Create public or private collections", "Save papers with personalized notes", "Track To Read / In Progress / Completed"]),
    ("User Features & Security", ["Registration and login", "Editable researcher profile", "Automatic reading history", "Token auth, password hashing, CORS, normalized errors"]),
    ("Database & Application Modules", ["Paper + Author: normalized metadata", "Summary: one-to-one synthesis", "Collection + CollectionItem: reading queues", "Vote + ReadingHistory + UserProfile"]),
    ("Testing & Future Scope", ["Backend model, service, and API tests", "PDF full-text extraction", "Semantic search and multilingual summaries", "PostgreSQL and production AI deployment"]),
    ("Conclusion", ["ScholarLens combines live literature retrieval", "Provides structured, accessible synthesis", "Supports collections, citations, and reading history"]),
]

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

def add_text(slide, text, left, top, width, height, size=24, color=INK, bold=False, align=None):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.clear()
    tf.margin_left = Inches(0.05)
    tf.margin_right = Inches(0.05)
    p = tf.paragraphs[0]
    p.text = text
    p.font.name = "Aptos"
    p.font.size = Pt(size)
    p.font.bold = bold
    p.font.color.rgb = color
    if align:
        p.alignment = align
    return box

def add_header(slide, title):
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = LIGHT
    add_text(slide, title, 0.75, 0.45, 11.8, 0.55, 28, NAVY, True)
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.75), Inches(1.12), Inches(11.85), Inches(0.03))
    line.fill.solid()
    line.fill.fore_color.rgb = BLUE
    line.line.fill.background()

def add_bullets(slide, items, left=1.15, top=1.55, width=10.8, size=22):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(4.8))
    tf = box.text_frame
    tf.clear()
    tf.margin_left = Inches(0.15)
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = item
        p.level = 0
        p.font.name = "Aptos"
        p.font.size = Pt(size)
        p.font.color.rgb = INK
        p.space_after = Pt(16)
        p.text = "• " + p.text

for index, (title, items) in enumerate(slides):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    if index == 0:
        slide.background.fill.solid()
        slide.background.fill.fore_color.rgb = NAVY
        add_text(slide, "ScholarLens", 1.0, 2.0, 11.3, 0.9, 42, WHITE, True, PP_ALIGN.CENTER)
        add_text(slide, items[0], 1.0, 3.05, 11.3, 0.55, 24, RGBColor(219, 234, 254), False, PP_ALIGN.CENTER)
        add_text(slide, items[1], 1.0, 4.05, 11.3, 0.45, 18, WHITE, False, PP_ALIGN.CENTER)
        continue

    add_header(slide, title)
    if title == "System Architecture":
        labels = ["React 18\nVite UI", "REST APIs\nAxios", "Django 6\nDRF", "SQLite\narXiv API"]
        xs = [0.85, 3.85, 6.85, 9.85]
        colors = [BLUE, RGBColor(14, 165, 233), NAVY, RGBColor(5, 150, 105)]
        for i, (label, x, color) in enumerate(zip(labels, xs, colors)):
            shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(2.55), Inches(2.2), Inches(1.35))
            shape.fill.solid()
            shape.fill.fore_color.rgb = color
            shape.line.color.rgb = color
            add_text(slide, label, x + 0.12, 2.82, 1.96, 0.75, 18, WHITE, True, PP_ALIGN.CENTER)
            if i < 3:
                add_text(slide, "→", x + 2.28, 2.85, 0.5, 0.5, 24, MUTED, True, PP_ALIGN.CENTER)
        add_text(slide, "User Interface  •  JSON Contracts  •  Business Logic  •  Data Sources", 1.35, 5.1, 10.6, 0.45, 16, MUTED, False, PP_ALIGN.CENTER)
    elif title == "Structured Paper Analysis":
        cards = ["Executive\nOverview", "Key\nFindings", "Methodology", "Lay\nSummary", "Limitations", "BibTeX"]
        for i, card in enumerate(cards):
            row, col = divmod(i, 3)
            x, y = 1.25 + col * 3.9, 1.65 + row * 2.15
            shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(3.25), Inches(1.55))
            shape.fill.solid()
            shape.fill.fore_color.rgb = WHITE
            shape.line.color.rgb = BORDER
            add_text(slide, card, x + 0.25, y + 0.35, 2.75, 0.85, 19, NAVY, True, PP_ALIGN.CENTER)
    else:
        add_bullets(slide, items)

    add_text(slide, f"{index + 1}", 12.25, 7.05, 0.35, 0.25, 9, MUTED, False, PP_ALIGN.RIGHT)

prs.save(OUT)
print(OUT)
