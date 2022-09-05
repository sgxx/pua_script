# -*- coding: utf-8 -*-

from flask import Flask, render_template
import random

app = Flask(__name__)

num = 0
used = set([])

dictResult = dict()

with open(r'./static/words.txt', encoding='utf-8') as f:
    lines = f.readlines()

    length = len(lines)

    for i in range(length - 1):
        before = lines[i].replace("\n", "")
        after = lines[i + 1].replace("\n", "")

        if before.startswith("Q:"):
            dictResult[before] = after


@app.route('/')
def hello_world():
    print('getting')
    while True:
        question = random.choice(list(dictResult.keys()))
        if question not in used:
            # global used
            global num
            used.add(question)
            num += 1
            return render_template('index.html', question=question, answer=dictResult[question], num=num)


@app.route('/clearNum')
def clearNum():
    print('clearing')
    global num
    num = 0
    used = set([])
    return "ok"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=1998)
