import cv2
from fer import FER
import base64
import numpy as np

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml')
emotion_detector = FER()

def process_frame(base64_string):
    # Remove header information from base64 string
    base64_string = base64_string.split(",")[1]
    # Decode base64 string to bytes
    image_bytes = base64.b64decode(base64_string)
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    # Decode numpy array to OpenCV image
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # Resize the frame
    frame = cv2.resize(frame, (0, 0), fx=0.7, fy=0.7)
    # Crop the frame if needed
    frame = frame[:, 50:, :]
    # Convert BGR to RGB
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    return frame

def detect_emotions(frame):
    emotions = emotion_detector.detect_emotions(frame)
    return emotions

def analyze_fun(frames):
    emotion_data = []

    for frame_data in frames:
        processed_frame = process_frame(frame_data)

        emotions = detect_emotions(processed_frame)
        if emotions:
            emotion_data.append(emotions[0]['emotions'])

    return emotion_data