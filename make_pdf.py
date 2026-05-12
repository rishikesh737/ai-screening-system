import os
import sys
# Set up the exact paths
venv_path = os.path.abspath("backend/.venv/lib64/python3.11/site-packages")
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)

from fpdf import FPDF
pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)
text = "AI ML Engineer book concepts. Gradient descent minimizes loss. " * 50
pdf.multi_cell(0, 10, txt=text)
pdf.output("knowledge_base/books/dummy.pdf")
print("PDF created successfully!")
