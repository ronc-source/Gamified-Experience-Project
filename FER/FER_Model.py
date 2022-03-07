import numpy as np

#import matplotlib.pyplot as plt
#import torch.nn as nn
#import torch.nn.functional as F
#import os
from tensorflow import keras
from keras import layers
#from keras.datasets import mnist
#from keras.preprocessing.image import load_img, img_to_array
from keras.preprocessing.image import image_dataset_from_directory





#Step 1: Get Training and Test Data for Model from Dataset (FER 2013)




training_dataset = image_dataset_from_directory(
    directory = "DataSet/train",
    image_size = (48, 48),
    color_mode = "grayscale",
    batch_size = 32,
    shuffle = True,
    class_names = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
)


test_dataset = image_dataset_from_directory(
    directory = "DataSet/test",
    image_size = (48, 48),
    color_mode = "grayscale",
    batch_size = 32,
    shuffle = False,
    class_names = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
)



#Step 2: CNN Model 

#CNN From KERAS
inputs = keras.Input(shape=(48, 48, 1))

#Standardization -> Put image values to [0,1] instead of [0,255]
cnn_component = layers.Rescaling(1./255)(inputs)

#First Layer
cnn_component = layers.Conv2D(filters = 64, kernel_size = 3)(inputs)
cnn_component = layers.BatchNormalization()(cnn_component)
cnn_component = layers.Activation("relu")(cnn_component)
cnn_component = layers.Dropout(0.2)(cnn_component)
cnn_component = layers.MaxPooling2D(pool_size=2)(cnn_component)


#Second Layer
cnn_component = layers.Conv2D(filters = 128, kernel_size = 3)(cnn_component)
cnn_component = layers.BatchNormalization()(cnn_component)
cnn_component = layers.Activation("relu")(cnn_component)
cnn_component = layers.Dropout(0.2)(cnn_component)
cnn_component = layers.MaxPooling2D(pool_size=2)(cnn_component)

#Third Layer
cnn_component = layers.Conv2D(filters = 256, kernel_size = 3)(cnn_component)
cnn_component = layers.BatchNormalization()(cnn_component)
cnn_component = layers.Activation("relu")(cnn_component)
cnn_component = layers.Dropout(0.2)(cnn_component)
cnn_component = layers.MaxPooling2D(pool_size=2)(cnn_component)



#Fully Connected Layers
cnn_component = layers.Flatten()(cnn_component)
cnn_component = layers.Dense(256, activation = "elu")(cnn_component)
outputs = layers.Dense(7, activation = "softmax")(cnn_component)

cnn_model = keras.Model(inputs=inputs, outputs=outputs)


#Detailed Summary on the CNN Model
#Step 3: Compile, Train and Test Model with Accuracy as the primary evaluation metric
cnn_model.summary()

cnn_model.compile(optimizer= keras.optimizers.Adam(learning_rate = 0.0001), loss = "sparse_categorical_crossentropy", metrics = ["accuracy"])

cnn_model.fit(training_dataset, epochs = 20, batch_size = 32)

testing_loss, testing_accuracy = cnn_model.evaluate(test_dataset)
print(f"test accuracy: {testing_accuracy}")




#NOTE: CURRENT CNN: @ EPOCH 20: 87% TRAIN ACCURACY, LOSS: 0.3661, TEST ACCURACY: 0.572


#Step 4: Save the Model with its current weight values



'''
#CNN FROM PYTORCH
CNN_Model  = nn.Sequential(

#1st Layer
nn.Conv2d(in_channels=1, out_channels = 32, kernel_size = 3, stride = 1, padding = 1),
nn.BatchNorm2d(32),
nn.ReLU(),
nn.Dropout(0.2),

#2nd Layer
nn.Conv2d(in_channels=32, out_channels=64, kernel_size = 3, stride = 1, padding = 1),
nn.BatchNorm2d(64),
nn.ReLU(),
nn.MaxPool2d(2,2),
nn.Dropout(0.2),

#3rd Layer
nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, stride=1, padding=1 ),
nn.BatchNorm2d(128),
nn.ReLU(),
nn.Dropout(0.2),

#4th Layer
nn.Conv2d(in_channels=128, out_channels=256, kernel_size=3, stride=1, padding=1 ),
nn.BatchNorm2d(256),
nn.ReLU(),
nn.MaxPool2d(2,2),
nn.Dropout(0.2),

#Fully Connected 1st Layer

#input is 48x48 grayscale
# 3x3 convolution with padding

#Layer 1
#(48-3)/1 + 1 = 46x46
#Max pooling = 2x2 -> 46/2 = 23x23

#Layer 2
#(23-3)/1 + 1 = 21x21
#Max pooling -> 21/2 -> 10.5x10.5

#Layer 3
#(10.5-3)/1 + 1 = 8.5
#Max Pooling -> 8.5/2 -> 4.25x4.25

#Layer 4
#(4.25-3)/1 + 1 = 2.25
#Max Pooling -> 2.25/2 -> 1.125x1.125


#Fully Connected Layers -> Output = 7 Emotion Classification
#Collapse the input size to 1D
nn.Flatten(),
nn.Linear(256*4*4,70),
nn.ReLU(),
nn.Linear(70, 7),


)



class ConvultionalNetwork(nn.Module):
    def __init__(self): 
        #in_channels = number of channels in the layer above or in the first layer, the number of channels in the data (3 = RGB)
        #out_channels = matter of preference

        #padding = (kernel_size - 1) / 2
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, stride=1, padding=1)
        self.batchnorm1 = nn.BatchNorm2d
    
    def forward(self, x):
        pass
'''