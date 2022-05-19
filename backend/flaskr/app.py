from flask import Flask
from flask import request
import cv2
from flask_cors import CORS
import sys
import numpy as np
from flask import jsonify

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "Hello, cross-origin-world!"


@app.route("/rectangles", methods=['POST'])
def detect_rectangles():
    f = request.files.get("diagramFile", None)
    if(not f):
        return {"Msg:": "Wrong file"}
    

    # Make image as image..
    fileImageData = np.asarray(bytearray(f.read()), dtype="uint8")
    #fileImageData = bytearray(f.read())

    # Load iamge, grayscale, adaptive threshold
    #image = cv2.imread(f)
    image = cv2.imdecode(fileImageData, cv2.IMREAD_COLOR)
    result = image.copy()
    gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV,51,9)

    # Fill rectangular contours
    cnts = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    for c in cnts:
        cv2.drawContours(thresh, [c], -1, (255,255,255), -1)

    # Morph open
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9,9))
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=4)

    # Draw rectangles
    cnts = cv2.findContours(opening, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    response = []
    for c in cnts:
        x,y,w,h = cv2.boundingRect(c)
        response.append({"x": x, "y": y, "width": w, "height": h})
        cv2.rectangle(image, (x, y), (x + w, y + h), (36,255,12), 3)

    # cv2.imshow('thresh', thresh)
    # cv2.imshow('opening', opening)
    # cv2.imshow('image', image)
    # cv2.waitKey()
    return jsonify(response)