#! /usr/bin/python

f = open("drinks.txt", "r")
f.readline()
import json
import ast
import random



ls = ast.literal_eval(f.readline())
file = open('drink_insertions.sql','w')
file.write('use project;'+'\n'+'\n')
stores=[i for i in range(1,335)]
ingreek = {'beers':'μπύρα', 'wines':'κρασί','rum':'ρούμι','whisky':'whisky','vodka':'vodka'}
i=0
for data in ls:
	price = data['Cost'].split(',')
	cost = ''
	for c in price:
		cost += c
	desc = data['Description'].split()
	if desc[-1] == 'ml' or desc[-1] == 'Lt':
		if desc[-1] == 'ml':
			ml = float(desc[-2])
		else:
			ml = float(desc[-2])*1000
		description = ''
		for j in range(len(desc)-2):
			description += ' ' + desc[j]
		insert_st = "insert into Drinks(Drink_Id,Category,Description,Price,Ml,Tag,Store_Id)\n"
		values_st = "values ({},'{}','{}',{},{},'{}',{});\n".format(i+1,ingreek[data['Category']],description,float(cost),ml,data['Tags'],random.choice(stores))
	else:
		insert_st = "insert into Drinks(Drink_Id,Category,Description,Price,Tag,Store_Id)\n"
		values_st = "values ({},'{}','{}',{},'{}',{});\n".format(i+1,ingreek[data['Category']],data['Description'],float(cost),data['Tags'],random.choice(stores))
	i+=1
	file.write(insert_st)
	file.write(values_st)
