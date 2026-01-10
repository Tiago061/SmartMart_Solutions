import csv

def read_csv(file):
    content = file.file.read().decode("utf-8").splitlines()
    reader = csv.DictReader(content)
    return list(reader)