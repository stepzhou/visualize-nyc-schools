#this file merges the datasets to be used in the interactive visualization on the website

loc = read.csv("school_police_city.csv", header = T, stringsAsFactors = F)
grad = read.csv("gradandregents.csv", header = T, stringsAsFactors = F)
sat = read.csv("SAT_Results.csv", header = T, stringsAsFactors = F)
groups = read.csv("schoolclusters.csv", header = T, stringsAsFactors = F)

for (i in 1:1548){
	loc[i, 1] = substr(loc[i,1], 1, 6)	
}

all = merge(loc, grad, by.x = "ATS_CODE", by.y = "DBN")
all = merge(all, sat, by.x = "ATS_CODE", by.y = "DBN")
all = merge(all, groups, by.x = "ATS_CODE", by.y = "DBN")

#polic precint with top grad rates
require(sqldf)
all1 = all
gradprec = sqldf('select Precinct, avg(pctgrad) from all1 group by Precinct order by avg(pctgrad)')
all1$apm = all$Pct.of.cohort.achieving.APM
apmprec= sqldf('select Precinct, avg(apm) from all1 group by Precinct order by avg(apm)')

#joining all the schools

high = loc$ATS_CODE[loc$SCH_TYPE == "K-12 all grades" | loc$SCH_TYPE == "High school" | loc$SCH_TYPE == "Secondary School"]
grad2 = read.csv("school_gradrate.csv", header = T, stringsAsFactors = F)
sat2 = read.csv("school_sat.csv", header = T, stringsAsFactors = F)
regents2 = read.csv("school_regents.csv", header = T, stringsAsFactors = F)
groups2 = read.csv("school_clusters.csv", header = T, stringsAsFactors = F)
grades2 = read.csv("school_grade.csv", header = T, stringsAsFactors = F)

out = merge(high, sat2, by.x = 1, by.y = 1, all.x = T, all.y = F)
out = merge(out, regents2[, c(1,3)], by.x = 1, by.y = 1, all.x = T, all.y = F)
out = merge(out, groups2, by.x = 1, by.y = 1, all.x = T, all.y = F)
out = merge(out, grades2, by.x = 1, by.y = 1, all.x = T, all.y = F)

#grad and regents
grad3 = read.csv("gradandregents.csv", header=T, stringsAsFactors = F)
grad3 = grad[grad$Cohort.Year == 2007,]
grad3 = grad3[,c(1, 7)]
grad2 = read.csv("schools_gradrate.csv", header = T, stringsAsFactors = F)
out = merge(out, grad2, by.x = 1, by.y = 1, all.x = T, all.y = F)
