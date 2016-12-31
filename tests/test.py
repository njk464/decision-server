import requests
import json
import random
import time

timesteps = 10
headers = {"Content-Type": "application/json"}
endpoint = 'http://localhost:3000/api'
settings_file = '../private/settings.json'
tasks_file = '../private/tasks.json'

ids = []
tasks = {}
hashes = []
prev_num_tasks = []

def get_tasks():
  global tasks
  f = open(tasks_file, 'r')
  tasks = json.loads(f.read())

  for i in range(0, 6):
    hashes.append([])

  for task in tasks["tasks"]:
    hashes[task["day"]].append(task["hash"])

  f.close()

def get_users():
  f = open(settings_file, 'r')
  for line in f:
    l = line.strip()
    if l.startswith('"password"'):
      ids.append(l.split('"')[3])

  f.close()

def get_rand_tasks(day):
  task_pool = hashes[day]
  max_tasks = len(task_pool)
  rand_tasks = []
  num_tasks = random.randint(0, max_tasks)

  for i in range(0, num_tasks):
    task = random.choice(task_pool)
    while task in rand_tasks:
      task = random.choice(task_pool)
    rand_tasks.append(task.encode("utf-8"))

  return str(rand_tasks).replace('\'', '\"')

def main():
  get_users()
  get_tasks()
  for t in range(0, timesteps):
    for i in ids:
      rand_tasks = get_rand_tasks(0)
      data = '{"' + i + '": ' + rand_tasks + '}'
      print data
      r = requests.post(endpoint, headers=headers, data=data)
      if r.text != 'success':
        print r.text
      time.sleep(15)
    print '[+] Completed timestep ' + str(t)

if __name__ == '__main__':
  main()