#getting the stats for the pop-up text for the website

#schools
loc = read.csv("school_police_city.csv", header = T, stringsAsFactors = F)
grad = read.csv("gradandregents.csv", header = T, stringsAsFactors = F)
sat = read.csv("SAT_Results.csv", header = T, stringsAsFactors = F)
groups = read.csv("schoolclusters.csv", header = T, stringsAsFactors = F)
grades = read.csv("school_grade.csv", header = F, stringsAsFactors = F)

for (i in 1:1548){
	loc[i, 1] = substr(loc[i,1], 1, 6)	
}
grad = grad[grad$Cohort.Year == 2007,]

all = merge(loc, grad, by.x = "ATS_CODE", by.y = "DBN")
all = merge(all, sat, by.x = "ATS_CODE", by.y = "DBN")
all = merge(all, groups, by.x = "ATS_CODE", by.y = "DBN")
all = merge(all, grades, by.x = "ATS_CODE", by.y = "V1")

regents = as.numeric(gsub("%", "", all$Pct.of.cohort.achieving.APM.x))
satscore = as.numeric(all$SAT.Critical.Reading.Avg..Score.x) + as.numeric(all$SAT.Math.Avg..Score.x) + as.numeric(all$SAT.Writing.Avg..Score.x)

#this is all the schools information
edit = data.frame(dbn = all$ATS_CODE, gradrate=as.numeric(all$pct.grad.x), regents = regents, sat = satscore, groups = all$fit.cluster, grade = all$V2, precinct = all$Precinct, district = all$ADMIN_DIST)
 

require(sqldf)
#grouping grad rate, regents pass rate, sat scores by police precinct 
gradprec = sqldf('select precinct, avg(gradrate) from edit group by precinct order by avg(gradrate)')
regprec = sqldf('select precinct, avg(regents) from edit group by precinct order by avg(regents)')
satprec = sqldf('select precinct, avg(sat) from edit group by precinct order by avg(sat)')

#grouping grad rate, regents pass rate, sat scores by school district
graddist = sqldf('select district, avg(gradrate) from edit group by district order by avg(gradrate)')
regdist = sqldf('select district, avg(regents) from edit group by district order by avg(regents)')
satdist = sqldf('select district, avg(sat) from edit group by district order by avg(sat)')

#reading in district and precinct data
attendenroll = read.csv("attend_enroll.csv", header = T, stringsAsFactors = F)

attendenroll2 = merge(graddist, attendenroll, by.x ="district", by.y = "District")
cor(attendenroll2[,2], as.numeric(attendenroll2$YTD...Attendance..Avg.))
#The correlation between average attendence in school and graduation rate is 0.5886144
cor(attendenroll2[,2], as.numeric(attendenroll2$YTD.Enrollment.Avg.))
#0.07192386

attendenroll2 = merge(regdist, attendenroll, by.x ="district", by.y = "District")
cor(attendenroll2[,2], as.numeric(attendenroll2$YTD...Attendance..Avg.))
#0.5928747
cor(attendenroll2[,2], as.numeric(attendenroll2$YTD.Enrollment.Avg.))
#0.1565688

attendenroll2 = merge(satdist, attendenroll, by.x ="district", by.y = "District")
cor(attendenroll2[,2], as.numeric(attendenroll2$YTD...Attendance..Avg.))
#0.621284
cor(attendenroll2[,2], as.numeric(attendenroll2$YTD.Enrollment.Avg.))
#0.2312861

assistance = read.csv("percent_pubassistance.csv", header = T, stringsAsFactors = F)
assistance2 = merge(graddist, assistance, by.x ="district", by.y = "JURISDICTION.NAME")
cor(assistance2[,2], as.numeric(assistance2$PERCENT.RECEIVES.PUBLIC.ASSISTANCE))
#-0.1538863

assistance2 = merge(regdist, assistance, by.x ="district", by.y = "JURISDICTION.NAME")
cor(assistance2[,2], as.numeric(assistance2$PERCENT.RECEIVES.PUBLIC.ASSISTANCE))
#-0.1623343

assistance2 = merge(satdist, assistance, by.x ="district", by.y = "JURISDICTION.NAME")
cor(assistance2[,2], as.numeric(assistance2$PERCENT.RECEIVES.PUBLIC.ASSISTANCE))
#-0.1863978

noise = read.csv("school_noise binned.csv", header = T, stringsAsFactors = F)
noise2 = merge(graddist, noise, by.x = "district", by.y = "SchoolDist")
cor(noise2[,2], as.numeric(noise2$PNTCNT))
#0.135222

noise2 = merge(regdist, noise, by.x = "district", by.y = "SchoolDist")
cor(noise2[,2], as.numeric(noise2$PNTCNT))
#0.173886

noise2 = merge(satdist, noise, by.x = "district", by.y = "SchoolDist")
cor(noise2[,2], as.numeric(noise2$PNTCNT))
#0.2146224

graffiti = read.csv("school_graffiti.csv", header = T, stringsAsFactors = F)
graffiti2 = merge(graddist, graffiti, by.x = "district", by.y = "SchoolDist")
cor(graffiti2[,2], as.numeric(graffiti2$PNTCNT))
#0.05013801

graffiti2 = merge(regdist, graffiti, by.x = "district", by.y = "SchoolDist")
cor(graffiti2[,2], as.numeric(graffiti2$PNTCNT))
#0.08964188

graffiti2 = merge(satdist, graffiti, by.x = "district", by.y = "SchoolDist")
cor(graffiti2[,2], as.numeric(graffiti2$PNTCNT))
#0.1454501

#now for the categorical variables
#binning district values based on grade
attendenroll3 = merge(edit, attendenroll, by.x ="district", by.y = "District")
aggregate(as.numeric(attendenroll3$YTD...Attendance..Avg.), by = list(attendenroll3$grade), FUN = mean, na.rm = T)

aggregate(as.numeric(attendenroll3$YTD.Enrollment.Avg.), by = list(attendenroll3$grade), FUN = mean, na.rm = T)

assistance2 = merge(edit, assistance, by.x ="district", by.y = "JURISDICTION.NAME")
aggregate(as.numeric(assistance2$PERCENT.RECEIVES.PUBLIC.ASSISTANCE), by = list(assistance2$grade), FUN = mean, na.rm = T)

noise3 = merge(edit, noise, by.x ="district", by.y = "SchoolDist")
aggregate(as.numeric(noise3$PNTCNT), by = list(noise3$grade), FUN = mean, na.rm = T)

graffiti3 = merge(edit, graffiti, by.x ="district", by.y = "SchoolDist")
aggregate(as.numeric(graffiti3$PNTCNT), by = list(graffiti3$grade), FUN = mean, na.rm = T)

#binning based on cluster
attendenroll3 = merge(edit, attendenroll, by.x ="district", by.y = "District")
aggregate(as.numeric(attendenroll3$YTD...Attendance..Avg.), by = list(attendenroll3$groups), FUN = mean, na.rm = T)

aggregate(as.numeric(attendenroll3$YTD.Enrollment.Avg.), by = list(attendenroll3$groups), FUN = mean, na.rm = T)

assistance2 = merge(edit, assistance, by.x ="district", by.y = "JURISDICTION.NAME")
aggregate(as.numeric(assistance2$PERCENT.RECEIVES.PUBLIC.ASSISTANCE), by = list(assistance2$groups), FUN = mean, na.rm = T)

noise3 = merge(edit, noise, by.x ="district", by.y = "SchoolDist")
aggregate(as.numeric(noise3$PNTCNT), by = list(noise3$groups), FUN = mean, na.rm = T)

graffiti3 = merge(edit, graffiti, by.x ="district", by.y = "SchoolDist")
aggregate(as.numeric(graffiti3$PNTCNT), by = list(graffiti3$groups), FUN = mean, na.rm = T)

