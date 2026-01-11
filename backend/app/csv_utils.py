import csv
import codecs

def read_csv(file):
    file.file.seek(0)
  
    stream = codecs.iterdecode(file.file, 'utf-8-sig')
    reader = csv.DictReader(stream)
   
    reader.fieldnames = [n.strip().lower() for n in reader.fieldnames]
    return list(reader)