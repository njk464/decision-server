#!/usr/bin/env python 
#
###############################################################
# Wellington Lee <wklee@sandia.gov>                           #
# July 2016                                                   #
# Takes CSV file of tasks and pretty prints in JSON format.   #
###############################################################

from csv import reader
from json import loads, dumps
from sys import exit
import sys

def main():

  tasks = []
  cnt = 0

  # Read CSV file into tasks list
  with open(sys.argv[1], 'rb') as csvfile:
    csvreader = reader(csvfile, delimiter=',')
    csv_headers = csvreader.next()
    for row in csvreader:
      obj = {
        csv_headers[0] : str(row[0]).decode('utf-8', 'ignore'),
        csv_headers[1] : int(row[1]),
        csv_headers[2] : str(row[2]),
        csv_headers[3] : str(row[3]),
        csv_headers[4] : str(row[4]),
        csv_headers[5] : str(row[5]),
        csv_headers[6] : str(row[6])
      }
      tasks.append(obj)
      cnt += 1

  # Dump as JSON to get rid of single quotes
  js = dumps(tasks, indent=2, separators=(',', ' : '))
  json_spl = js.split('\n')

  # Tab in for niceness
  js = '\n'.join(['  ' + line for line in json_spl])
  tmp = loads(js)

  # Assertions for cleanliness
  try:
    assert len(tmp) == cnt
  except:
    exit('Failed length of json object assertion.')
  try:
    assert len(tasks) > 0
  except:
    exit('No tasks loaded.')

  # Print JSON output to stdout #
  print '{\n  "tasks" : %s\n}' % js

if __name__ == '__main__':
  main()
