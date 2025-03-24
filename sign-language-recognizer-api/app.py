from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import re
from ultralytics import YOLO
import math

model = YOLO("yolo-Weights/alphabet.pt")
classNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'additional', 'alcohol', 'allergy', 'bacon', 'bag', 'barbecue', 'bill', 'biscuit', 'bitter', 'bread', 'burger', 'bye', 'cake', 'cash', 'cheese', 'chicken', 'coke', 'cold', 'cost', 'coupon', 'credit card', 'cup', 'dessert', 'drink', 'drive', 'eat', 'eggs', 'enjoy', 'fork', 'french fries', 'fresh', 'hello', 'hot', 'icecream', 'ingredients', 'juicy', 'ketchup', 'lactose', 'lettuce', 'lid', 'manager', 'menu', 'milk', 'mustard', 'napkin', 'no', 'order', 'pepper', 'pickle', 'pizza', 'please', 'ready', 'receipt', 'refill', 'repeat', 'safe', 'salt', 'sandwich', 'sauce', 'small', 'soda', 'sorry', 'spicy', 'spoon', 'straw', 'sugar', 'sweet', 'thank-you', 'tissues', 'tomato', 'total', 'urgent', 'vegetables', 'wait', 'warm', 'water', 'what', 'yoghurt', 'your']

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_frame', methods=['POST'])
def process_frame():

    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image data received'}), 400

    image_data = data['image']
    
    #Base64-encoded extraction portion
    match = re.match(r'^data:image/(png|jpeg);base64,(.*)$', image_data)
    if not match:
        return jsonify({'error': 'Invalid image data'}), 400

    base64_str = match.group(2)
    img_bytes = base64.b64decode(base64_str)
    img_array = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    results = model(frame)
    detected_labels = []  # Store detected words iin this array

    for result in results:
        boxes = result.boxes
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            class_id = int(box.cls[0])
            confidence = box.conf[0]

            # Get label names
            label = classNames[class_id] if class_id < len(classNames) else 'Unknown'
            detected_labels.append(label)

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{label} {confidence:.2f}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    # Reencode the frame
    _, buffer = cv2.imencode('.png', frame)
    processed_base64 = base64.b64encode(buffer).decode('utf-8')
    processed_data_url = f"data:image/png;base64,{processed_base64}"

    return jsonify({'processed_image': processed_data_url, 'labels': detected_labels})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
