# -*- coding: utf-8 -*-

import os
import time

if __name__ == '__main__':
    output = os.popen('netstat -tlnp | grep 1998', 'r')
    val = output.read()
    while "  " in val:
        val = val.replace("  ", " ")

    if '/' in str(val):
        pid = str(val).split(" ")[-2].split('/')[0]
        os.popen(f'kill -9 {pid}')
        time.sleep(2)

    output = os.popen('netstat -tlnp | grep 2022', 'r')
    val = output.read()
    while "  " in val:
        val = val.replace("  ", " ")

    if '/' in str(val):
        pid = str(val).split(" ")[-2].split('/')[0]
        os.popen(f'kill -9 {pid}')
        time.sleep(2)

    output = os.popen(f'cd /code/fla', 'r')
    val = output.read()

    os.system('nohup python3 app.py &')
    os.system('nohup python3 app1.py &')

    print('over')
