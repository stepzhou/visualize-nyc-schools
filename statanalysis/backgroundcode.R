#code for getting parents and teachers thoughts about the problems plaguing nyc public schools
progress = read.csv("progress_report.csv", skip = 2, header=T)

#overall grade
table(progress[,8])

#environment grade
table(progress[,16])

parents = read.csv("survey_parentpercent.csv", header = T)

#safety
par(mfrow = c(1,3))

safety =sapply(parents[, 77:80], as.numeric)
apply(safety, 2, mean)
overallsafe = barplot(apply(safety, 2, mean), col = "turquoise", main = "Overall", ylab = "% response", xaxt = "n", ylim = c(0,50))
axis(1, at=overallsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))
gradesurvey = merge(parents, progress, by.x = "dbn", by.y = "DBN")
lowgrades = gradesurvey[gradesurvey[,202] == "F",]
highgrades = gradesurvey[gradesurvey[,202] == "A",]

lowsafety = sapply(lowgrades[, 77:80], as.numeric)
lowsafe = barplot(apply(lowsafety, 2, mean), col = "turquoise", main = "F schools", ylab = "% response", xaxt = "n", ylim = c(0,50))
axis(1, at=lowsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

highsafety = sapply(highgrades[, 77:80], as.numeric)
highsafe = barplot(apply(highsafety, 2, mean), col = "turquoise", main = "A schools", ylab = "% response", xaxt = "n", ylim = c(0,50))
axis(1, at=highsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

#racsim
par(mfrow = c(1,3))
safety =sapply(parents[, 97:100], as.numeric)
overallsafe = barplot(apply(safety, 2, mean), col = "turquoise", main = "Overall", ylab = "% response", xaxt = "n", ylim = c(0, 35))
axis(1, at=overallsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

lowsafety = sapply(lowgrades[, 97:100], as.numeric)
lowsafe = barplot(apply(lowsafety, 2, mean), col = "turquoise", main = "F schools", ylab = "% response", xaxt = "n", ylim = c(0,35))
axis(1, at=lowsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

highsafety = sapply(highgrades[, 97:100], as.numeric)
highsafe = barplot(apply(highsafety, 2, mean), col = "turquoise", main = "A schools", ylab = "% response", xaxt = "n", ylim = c(0,35))
axis(1, at=highsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

##Gangs

par(mfrow = c(1, 3))
safety =sapply(parents[, 107:110], as.numeric)
overallsafe = barplot(apply(safety, 2, mean), col = "turquoise", main = "Overall", ylab = "% response", xaxt = "n", ylim = c(0, 40))
axis(1, at=overallsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

lowsafety = sapply(lowgrades[, 107:110], as.numeric)
lowsafe = barplot(apply(lowsafety, 2, mean), col = "turquoise", main = "F schools", ylab = "% response", xaxt = "n", ylim = c(0, 40))
axis(1, at=lowsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

highsafety = sapply(highgrades[, 107:110], as.numeric)
highsafe = barplot(apply(highsafety, 2, mean), col = "turquoise", main = "A schools", ylab = "% response", xaxt = "n", ylim = c(0,40))
axis(1, at=highsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

#fights

par(mfrow = c(1, 3))
safety =sapply(parents[, 102:105], as.numeric)
overallsafe = barplot(apply(safety, 2, mean), col = "turquoise", main = "Overall", ylab = "% response", xaxt = "n", ylim = c(0, 40))
axis(1, at=overallsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

lowsafety = sapply(lowgrades[, 102:105], as.numeric)
lowsafe = barplot(apply(lowsafety, 2, mean), col = "turquoise", main = "F schools", ylab = "% response", xaxt = "n", ylim = c(0, 40))
axis(1, at=lowsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

highsafety = sapply(highgrades[, 102:105], as.numeric)
highsafe = barplot(apply(highsafety, 2, mean), col = "turquoise", main = "A schools", ylab = "% response", xaxt = "n", ylim = c(0,40))
axis(1, at=highsafe, labels=c("Strongly Agree", "Agree", "Disagree", "Strongly Disagree"))

