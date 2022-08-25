import os
import time

if __name__ == '__main__':
    output = os.popen('netstat -tlnp | grep 1998', 'r')
    val = output.read()
    while "  " in val:
        val = val.replace("  ", " ")

    if '/' in str(val):
        pid = str(val).split(" ")[-2].split('/')[0]
        print('items', pid)

        os.popen(f'kill -9 {pid}')
        time.sleep(2)

    os.popen(f'cd /code/fla')
    os.popen(f'nohup python3 app.py &')

    print('over')
