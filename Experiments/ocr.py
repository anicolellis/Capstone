from PIL import Image

import pytesseract

# Experiment using OCR (Optical Character Recognition) to read images containing serial numbers.
# Some test images are available in this directory, with varying results.
# To run this experiment: install tesseract and pytesseract, and set the path to your tesseract.exe

pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
print(pytesseract.image_to_string(Image.open('serialnumber.jpg')))