# coding=utf-8


import difflib
import random


def string_similar(s1, s2):
    return difflib.SequenceMatcher(None, s1, s2).quick_ratio()


if __name__ == '__main__':
    answer = ''

    used = set([])

    with open("words.txt") as f:
        lines = f.readlines()

        length = len(lines)

        print(length)

        for i in range(1000):
            num = random.randint(0, length - 1)
            line = lines[num]
            if line.startswith('Q') and line not in used:
                used.add(line)

                print(line.replace("Q:", "Question:").replace("\n",""))
                answer = input("answer:")

                line = lines[num + 1].replace("A:", "")
                final = 0
                for item in line.split("|"):
                    final = max(final, round(string_similar(answer, item), 2))
                print(line.replace("\n", ""), final)
            else:
                continue
