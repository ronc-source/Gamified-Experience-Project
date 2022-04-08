#Face Detection inspired by https://docs.opencv.org/3.3.0/d7/d8b/tutorial_py_face_detection.html

import numpy as np
import cv2
from tensorflow import keras

import sys
from PIL import Image
import json
import urllib


imageData = json.loads(sys.stdin.readline())

#print(imageData)

result = urllib.request.urlopen(imageData)

with open("received_image.jpg", 'wb') as fh:
    fh.write(result.file.read())


receivedImage = cv2.imread('received_image.jpg')


#Declare cascade classifier used for Face Detection (Uses the pre-trained Haar Cascade Classifier)
frontFaceClassifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

#Declare Model to be used for Emotion Recognition and Emotion Classes
emotionModel = keras.models.load_model("fer_model_v2")
class_names = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']



#Search for face and mark it as a rectangle using the classifier
gray = cv2.cvtColor(receivedImage, cv2.COLOR_BGR2GRAY)
scaleFactor = 1.15
minNeighbors = 6
faces = frontFaceClassifier.detectMultiScale(gray, scaleFactor, minNeighbors)

#Get the face mapping from the image, re-format it, run it through the model and get the predicted emotion
for(x, y, width, height) in faces:
    recWidth = (x + width)
    recHeight = (y + height)
        
    grayFrame = cv2.resize(gray[y:recHeight, x:recWidth], (48,48))
    imgReformat = np.expand_dims(np.array(grayFrame), axis = 0)

    predictedEmotion = emotionModel.predict(imgReformat)
        
    classIndex = np.where(predictedEmotion[0] == np.amax(predictedEmotion[0]))
    print(class_names[classIndex[0][0]])
    sys.stdout.flush()
