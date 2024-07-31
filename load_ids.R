################################################################################
# load_ids.R
#
#Description: Reads csv file of participant data and writes every participant 
#id in a text file. Helps speed up processing 
#
# base taken from bonusPayment.R
# Author: Alana Jaskir, Frank Lab, Brown University
# Edited by: Mara Oancea, Nassar Lab, Brown University
# Created: May 2022
# Last Update: July 2024
################################################################################

require(tidyverse)
require(tibble)
require(dplyr)
require(plotrix)
require(ggplot2)
library(patchwork)

# read in data from version specified-> ACCESS summary file
basedir = "~/Dropbox (Brown)/onlineCannonTask/adLearning_web_HC"
version_to_analyze = paste(basedir, "/participant_responses/", sep="",collapse = NULL)
ids_file <- paste(version_to_analyze,"/participant_ids.txt",sep="",collapse = NULL)
csv_file = list.files(version_to_analyze, pattern=".csv")[1]
all_participants=read.csv(paste(version_to_analyze,csv_file,sep="",collapse = NULL))
all_participants$X = NULL

# -------------------------------------------------------------------------------

# calculate trials per block to deal with criterion
n_blocks <-  all_participants %>%
  filter(Status == "APPROVED") %>%
  group_by("Participant id") %>%
  summary(n_blocks)
# may toy around with filtering... 

# # -------------------------------------------------------------------------------

# get all participant ids
prolific_ids = unique(all_participants$Participant.id)
print_me <- c()
for (id in prolific_ids) {
  print(id)
  print_me <- append(print_me, paste(id,collapse = NULL))
}

# write to text file
print(print_me)
writeLines(print_me,ids_file,sep="\n")
