#making groups of schools according to SAT scores, regents scores, and grad rate
sat = read.csv("SAT_results.csv", header=T, stringsAsFactors = F)
grad = read.csv("gradandregents.csv", header=T, stringsAsFactors = F)

allscores = merge(sat, grad, by = "DBN")
allscores_recent = allscores[allscores$Cohort.Year == 2007,]
allscores_recent[allscores_recent == "s"] = NA
mydata1 <- na.omit(allscores_recent[,c(1,4,5,6, 11, 12)])
mydata <- mydata1[,-1] 
mydata[,4] = as.numeric(sub("%", "", mydata[,4]))
mydata[,1] = as.numeric(mydata[, 1])
mydata[,2] = as.numeric(mydata[, 2])
mydata[,3] = as.numeric(mydata[, 3])
mydata[,5] = as.numeric(mydata[, 5])
mydata <- scale(mydata)
# Determine number of clusters
wss <- (nrow(mydata)-1)*sum(apply(mydata,2,var))
for (i in 2:15) wss[i] <- sum(kmeans(mydata,centers=i)$withinss)
plot(1:15, wss, type="b", xlab="Number of Clusters",
ylab="Within groups sum of squares")
#bend is at 3
# K-Means Cluster Analysis
fit <- kmeans(mydata, 3) 
# get cluster means 
aggregate(mydata,by=list(fit$cluster),FUN=mean)
# append cluster assignment
mydata <- data.frame(mydata, fit$cluster)
mydata1 <- data.frame(mydata1, fit$cluster)

#write.csv(mydata1, "schoolclusters.csv")