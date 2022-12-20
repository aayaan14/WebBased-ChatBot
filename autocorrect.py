import nltk
#nltk.download('words')
from nltk.metrics.distance import jaccard_distance
from nltk.util import ngrams
from nltk.corpus import words

import csv
from traceback import print_tb

def converter():
    c=0
    correct_words = words.words()
    
    prof_names = []

    with open('sample_data.csv',mode='r') as file:
        csvFile = csv.reader(file)
        i=1
        for lines in csvFile:
            if i==1:
                prof_names = lines[1:]
    print(prof_names)
    for i in prof_names:
        correct_words.append(i)
    # incorrect_words=[]
    
    s = s.split(" ")
    for i,word in enumerate(s):
        if word not in correct_words:  # if the word is wrongly spelt
            temp = [(jaccard_distance(set(ngrams(word, 2)), #find the nearest correct word
                                    set(ngrams(w, 2))),w)
                    for w in correct_words if w[0]==word[0]]
            s[i]= sorted(temp, key = lambda val:val[0])[0][1]   # replace wrongly spelt word with closest correct word
            c+=1

    return (" ".join(s))

