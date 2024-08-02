################################################################################
# load_ids.R
#
#Description: Reads csv file of participant data and writes every participant 
#id in a text file. Helps speed up processing.
#Also, if input value is TRUE
# will process and print out ids missing from second session. 
#
# Notes: Get csv from "Download demographic data" on prolific. Make sure to redownload
# and delete old ones when new participants are ran and/or approved/rejected.
#
# base taken from bonusPayment.R
# Author: Alana Jaskir, Frank Lab, Brown University
# Edited by: Mara Oancea, Nassar Lab, Brown University
# Created: May 2022
# Last Update: July 2024
################################################################################
load_ids <- function(doSS){
  require(tidyverse)
  require(tibble)
  require(dplyr)
  require(plotrix)
  require(ggplot2)
  library(patchwork)

# read in data from version specified-> ACCESS summary file
  basedir = "~/Dropbox (Brown)/onlineCannonTask/"
  version_to_analyze = paste(basedir, "adLearning_web_HC/participant_responses/", sep="",collapse = NULL)
  ids_file <- paste(version_to_analyze,"/participant_ids.txt",sep="",collapse = NULL)
  csv_file = list.files(version_to_analyze, pattern=".csv")[1]
  all_participants=read.csv(paste(version_to_analyze,csv_file,sep="",collapse = NULL))
  all_participants$X = NULL

# -------------------------------------------------------------------------------

# filter out participants with rejected, returned, or timed out submissions
  select_participants <- filter(all_participants, Status == "APPROVED" | Status == "AWAITING REVIEW")

#if a new version of task was ran or you don't want to redownload participants
#filter to only get participants after a certain start time/date
  select_participants$Started.at <- ymd_hms(select_participants$Started.at, tz = "UTC")
# change the time value in here to whatever is needed 
  threshold_time <- ymd_hms("2024-07-13T00:00:00.376000Z", tz = "UTC")

  new_participants <- filter(select_participants, Started.at >= threshold_time)

# # -------------------------------------------------------------------------------

# get all participant ids
  prolific_ids = unique(new_participants$Participant.id)
  print_me <- c()
  print("First session ids")
  for (id in prolific_ids) {
    if (doSS == FALSE){    
      print(id)
    }
    print_me <- append(print_me, paste(id,collapse = NULL))
  }
# write to text file
  
  print(print_me)
  writeLines(print_me,ids_file,sep="\n")

# # -------------------------------------------------------------------------------
# trying to compare the first session participants and second session participants
  if (doSS == TRUE){
#access second session participants 
    version_to_analyze = paste(basedir, "secondSession/import_data/", sep="",collapse = NULL)
    ids_file <- paste(version_to_analyze,"secondSession_ids.txt",sep="",collapse = NULL)
    csv_file = list.files(version_to_analyze, pattern=".csv")[1]
    ss_participants=read.csv(paste(version_to_analyze,csv_file,sep="",collapse = NULL))
    ss_participants$X = NULL

  # filter out participants with rejected, returned, or timed out submissions
    ss_participants <- filter(ss_participants, Status == "APPROVED" | Status == "AWAITING REVIEW")

  #if a new version of task was ran or you don't want to redownload participants
  #filter to only get participants after a certain start time/date
    ss_participants$Started.at <- ymd_hms(ss_participants$Started.at, tz = "UTC")
  # use same  time value as above or a little later
    threshold_time <- ymd_hms("2024-07-20T00:00:00.376000Z", tz = "UTC")

    new_ss_participants <- filter(ss_participants, Started.at >= threshold_time)

  # NOW COMPARE SS PIDS with First session
  # get all participant ids
    ss_ids = unique(new_ss_participants$Participant.id)
    missing_ss = setdiff(prolific_ids, ss_ids)
    print("Participants that have not completed session 2:")
    for (id in missing_ss){
      print(id)
    }

  }
}

args <- commandArgs(trailingOnly = TRUE)
doSS <- args[1]

load_ids(doSS)