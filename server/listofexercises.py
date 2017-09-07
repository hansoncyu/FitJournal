from bs4 import BeautifulSoup
import requests

txt_file = open('./exercises.txt', 'w')
res = requests.get('http://www.workoutroutinewarehouse.com/tricep-exercises.html')
res.raise_for_status()
soup = BeautifulSoup(res.text)
exercise_elems = soup.select('table a')
for i in exercise_elems:
    txt_file.write(i.getText())
    txt_file.write('\n')
txt_file.close()
