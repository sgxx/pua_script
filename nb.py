#!/usr/bin/python
# -*- coding: UTF-8 -*-

questions=[]

with open("words.abc", "r",encoding='utf-8') as f:
    for line in f.readlines():
        # print(line.strip())
        if line.startswith("Q"):
            questions.append(line.strip())

length=len(questions)

for i in range(length):
    for j in range(i+1,length):
        # if questions[i] in questions[j] or questions[j] in questions[i]:
        #     print(questions[i],questions[j])
        if questions[i]==questions[j]:
            print(questions[i])
