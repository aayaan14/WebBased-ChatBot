import numpy as np
import random
import json
import re

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

from nltk_utils import bag_of_words, tokenize, stem
from model import NeuralNet

import csv
from traceback import print_tb

location = ''
faculty = ''
designation = ''
response = ''

#extract professors' names, designation and location
with open('sample_data.csv',mode='r') as file:
    csvFile = csv.reader(file)
    i=1
    for lines in csvFile:
        if i==1:
            faculty = lines[1:]
        elif i==2:
            designation = lines[1:]
        elif i==3:
            floor = lines[1:]
        elif i==4:
            dept = lines[1:]
        elif i==5:
            room = lines[1:]
        i+=1

#store each professors' tag, pattern and response in the JSON file 
for i,c in enumerate(faculty): 
    fac = []

    #creating the patterns
    fac=[c,"Where can I find "+c
        ,"Where will "+c+" be"
        ,"Where is the cabin of "+c
        ,"Where does "+c+" work"
        ,"How can I find "+c
        ,"How can I meet "+c]
    # fac.append(c)
    # fac.append("where can I find "+c)
    # fac.append("where will "+c+" be")
    # fac.append("where is the cabin of "+c)
    # fac.append("where does "+c+" work")

    #creating the location/response
    resL = [c+" can be found in the "+floor[i]+", "+room[i]+" room", 
        c+", "+designation[i]+" , works in the "+floor[i]+", "+room[i]+" room of the "+dept[i]+ " department",
        c+", who's working as " +designation[i]+ ", can be found in " +floor[i]+", "+room[i]+" room of " +dept[i]]
    
    tagname = c
    data = {"tag":tagname + "_location","patterns": fac, "responses":resL}
    f = open("intents.json", mode="r")
    intents = json.load(f)
    f.close()
    intents['intents'].append(data)
    f = open('intents.json', mode='w+')
    json.dump(intents, f)
    f.close()

for i,c in enumerate(faculty): 
    fac = []

    #creating the patterns
    fac=[c,"Who is "+c,
        "What does "+c+" do?",
        "In which department does "+c+" work for?"]
    # fac.append(c)
    # fac.append("where can I find "+c)
    # fac.append("where will "+c+" be")
    # fac.append("where is the cabin of "+c)
    # fac.append("where does "+c+" work")

    #creating the location/response
    resD = [c+" works as "+ designation[i] + " in the " +dept[i]+ " Department."]
    
    tagname = c
    data = {"tag":tagname + "_designation","patterns": fac,"responses":resD}
    f = open("intents.json", mode="r")
    intents = json.load(f)
    f.close()
    intents['intents'].append(data)
    f = open('intents.json', mode='w+')
    json.dump(intents, f)
    f.close()


all_words = []
tags = []
xy = []
# loop through each sentence in our intents patterns
for intent in intents['intents']:
    tag = intent['tag']
    # add to tag list
    tags.append(tag)
    for pattern in intent['patterns']:
        # tokenize each word in the sentence
        w = tokenize(pattern)
        # add to our words list
        all_words.extend(w)
        # add to xy pair
        xy.append((w, tag))

# stem and lower each word
ignore_words = ['?', '.', '!']
all_words = [stem(w) for w in all_words if w not in ignore_words]
# remove duplicates and sort
all_words = sorted(set(all_words))
tags = sorted(set(tags))

print(len(xy), "patterns")
print(len(tags), "tags:", tags)
print(len(all_words), "unique stemmed words:", all_words)

# create training data
X_train = []
y_train = []
for (pattern_sentence, tag) in xy:
    # X: bag of words for each pattern_sentence
    bag = bag_of_words(pattern_sentence, all_words)
    X_train.append(bag)
    # y: PyTorch CrossEntropyLoss needs only class labels, not one-hot
    label = tags.index(tag)
    y_train.append(label)

X_train = np.array(X_train)
y_train = np.array(y_train)

# Hyper-parameters 
num_epochs = 1000
batch_size = 8
learning_rate = 0.001
input_size = len(X_train[0])
hidden_size = 8
output_size = len(tags)
print(input_size, output_size)

class ChatDataset(Dataset):

    def __init__(self):
        self.n_samples = len(X_train)
        self.x_data = X_train
        self.y_data = y_train

    # support indexing such that dataset[i] can be used to get i-th sample
    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    # we can call len(dataset) to return the size
    def __len__(self):
        return self.n_samples

dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset,
                          batch_size=batch_size,
                          shuffle=True,
                          num_workers=0)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = NeuralNet(input_size, hidden_size, output_size).to(device)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

# Train the model
for epoch in range(num_epochs):
    for (words, labels) in train_loader:
        words = words.to(device)
        labels = labels.to(dtype=torch.long).to(device)
        
        # Forward pass
        outputs = model(words)
        # if y would be one-hot, we must apply
        # labels = torch.max(labels, 1)[1]
        loss = criterion(outputs, labels)
        
        # Backward and optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
    if (epoch+1) % 100 == 0:
        print (f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')


print(f'final loss: {loss.item():.4f}')

data = {
"model_state": model.state_dict(),
"input_size": input_size,
"hidden_size": hidden_size,
"output_size": output_size,
"all_words": all_words,
"tags": tags
}

FILE = "data.pth"
torch.save(data, FILE)

print(f'training complete. file saved to {FILE}')