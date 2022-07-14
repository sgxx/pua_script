# -*- coding: utf-8 -*-


import difflib
import random
import time


def string_similar(s1, s2):
    return difflib.SequenceMatcher(None, s1, s2).quick_ratio()


if __name__ == '__main__':
    answer = ''
    t_start = time.time()

    used = set([])

    with open(r"C:\project\self\2022\06\liaomei\words.txt",encoding='utf-8') as f:
        lines = f.readlines()

        length = len(lines)

        print(length)

        for i in range(1000):
            num = random.randint(0, length - 1)
            line = lines[num]
            if line.startswith('Q') and line not in used:
                used.add(line)

                print(line.replace("Q:", "Question:").replace("\n", ""))
                answer = input("answer:")

                line = lines[num + 1].replace("A:", "")
                final = 0
                for item in line.split("|"):
                    final = max(final, round(string_similar(answer, item), 2))
                print(line.replace("\n", ""), final)
            else:
                continue

    print('Processing cost {} seconds'.format(round(time.time() - t_start)))
