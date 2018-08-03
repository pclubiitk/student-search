#!/usr/bin/env python3

from bs4 import BeautifulSoup
import re
import requests
import sqlite3
conn = sqlite3.connect('../database/students.db')
c = conn.cursor()

s = requests.Session()
s.get("https://oa.cc.iitk.ac.in/Oa/Jsp/Main_Frameset.jsp")
s.get("https://oa.cc.iitk.ac.in/Oa/Jsp/Main_Intro.jsp?frm='SRCH'")
s.get("https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITK_Srch.jsp?typ=stud")

headers = {
    "Referer": "https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITK_Srch.jsp?typ=stud"
}

headers1 = {
    "Referer": "https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITk_SrchStudRoll_new.jsp"
}

payload = {
    'k4': 'oa',
    'numtxt': '',
    'recpos': 0,
    'str': '',
    'selstudrol': '',
    'selstuddep': '',
    'selstudnam': '',
    'txrollno': '',
    'Dept_Stud': '',
    'selnam1': '',
    'mail': ''
}

payload1 = {
    'typ': ['stud'] * 12,
    'numtxt': '',
    'sbm': ['Y'] * 12
}

TOTAL = 8385

def process_response_soup(soup, c):
    for link in soup.select('.TableText a'):
        roll = link.get_text().strip()
        payload1['numtxt'] = roll
        r1 = s.post("https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITk_SrchRes_new.jsp", headers=headers1, data=payload1)
        soup1 = BeautifulSoup(r1.text, 'html.parser')

        name = ''
        program = ''
        dept = ''
        hall = ''
        room = ''
        username = ''
        blood_group = ''
        gender = ''
        hometown = ''

        for para in soup1.select('.TableContent p'):
            body = para.get_text().strip()
            field = body.split(':')
            key = field[0].strip()
            value = field[1].strip()
            if key == 'Name':
                name = value.lower().title()
            elif key == 'Program':
                program = value
            elif key == 'Department':
                dept = value.lower().title()
            elif key == 'Hostel Info':
                if len(value.split(',')) > 1:
                    hall = value.split(',')[0].strip()
                    room = value.split(',')[1].strip()
            elif key == 'E-Mail':
                if len(value.split('@')) > 1:
                    username = value.split('@')[0].strip()
            elif key == 'Blood Group':
                blood_group = value
            elif key == 'Gender':
                if len(value.split('\t')) > 1:
                    gender = value.split('\t')[0].strip()
            else:
                print("{} {}".format(key, value))

        body = soup1.prettify()
        if len(body.split('Permanent Address :')) > 1:
            address = body.split('Permanent Address :')[1].split(',')
            if len(address) > 2:
                address = address[len(address) - 3: len(address) - 1]
                hometown = "{}, {}".format(address[0], address[1])

        c.execute('REPLACE INTO students VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  (roll, username, name, program, dept, hall, room,
                   blood_group, gender, hometown))


r = s.post("https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITk_SrchStudRoll_new.jsp", headers=headers, data=payload)
soup = BeautifulSoup(r.text, 'html.parser')
for link in soup.select('.DivContent'):
    substituted = re.sub(r'\s+', ' ', link.text)
    pattern = re.compile(r'\s*You are viewing 1 to 12 records out of (\d+) records\s*')
    match = pattern.match(substituted)
    TOTAL = int(match.group(1))
    print("Total: {}".format(TOTAL))
process_response_soup(soup, c)
print("Processed 12")
for i in range(12, TOTAL+1, 12):
    payload['recpos'] = i
    r = s.post("https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITk_SrchStudRoll_new.jsp", headers=headers, data=payload)
    soup = BeautifulSoup(r.text, 'html.parser')
    process_response_soup(soup, c)
    print("Processed {}".format(i + 12))
    conn.commit()
conn.close()
