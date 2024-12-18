# Learning Memory & Decision Lab Online Tasks with Honeycomb

This repository contains a pilot project for running online tasks at the [Brown Learning Memory & Decision Lab](https://sites.brown.edu/mattlab/).  It's based on [Honeycomb](https://github.com/brown-ccv/honeycomb) which is a starter repo for running [jsPsych](https://www.jspsych.org/7.3/) in desktop and online environments.  Honeycomb is maintained by members of the [Center for Computation and Visualization](https://ccv.brown.edu) and the [Neuromotion Lab](http://borton.engin.brown.edu/) at Brown University.

This README is adapted from the main [Honeycomb documentation](https://brown-ccv.github.io/honeycomb-docs/) to fit the Learning Memory & Decision Lab online tasks use case.

# Machine Setup

Before running, creating, and editing online tasks, you'll need to do some one-time machine setup.  This will give you the tools to be a web developer!

You won't actually have to become an expert in web development, but using these tools will enable good things like rapid local testing and automated, consistent code deployment to an online hosting service.

These steps will assume you're working on macOS.  Linux and Windows are also supported, though you might have to consult the main [Honeycomb documentation](https://brown-ccv.github.io/honeycomb-docs/) for details.

## Editor / IDE
To edit task code and project configuration, get a good text editor or IDE (Integrated Development Environment).  One good, free one is [Visual Studio Code](https://code.visualstudio.com/).

## Command line tools
Install the macOS Command Line Development Tools.  This will install several tools including [Git](https://git-scm.com/), which is needed for accessing code repositories like this one, and Python, which is used during Honeycomb project builds.

In a terminal, run
```
xcode-select --install
```

Check that expected tools were installed
```
git --version
# git version 2.36.1 (2.20 or greater is good)

python3 --version
# Python 3.8.5 (3.7 or greater is good)
```

## Node.js
Install Node.js, the main tool for confiuring and building Javascript projects.  Get the [macOS installer here](https://nodejs.org/en/download/).

Check that node itself was installed, plus the Javascript package manager `npm`
```
node --version
# v16.15.1 (16 or greater is good)

npm --version
8.11.0 (8 or greater is good)
```

# Test the task locally
Once you're set up above, you should be able to get, build, and run the task in this pilot project.

## Clone the pilot repository
If you haven't already, use Git to clone this very repository.
```
git clone https://github.com/learning-memory-and-decision-lab/honeycombPilot
```

## Install Javascript dependencies
Node will manage many Javascript dependencies for this project.  Before you can run the task, you need to tell node to go fetch all the dependencies.

You can do this with the `npm` command.  It might take a few minutes.
```
npm install
# downloads half the Internet
# some logging and warnings are expected
```
If having issues with packages, you can try rerunning this command. If that doesn't work, you can run rm -rf node_modules -> rm package-lock -> npm install

## Play the task
Finally we can try playing through the task.

When we run it here via Honeycomb, the task itself will be preceeded by a login page to prompt the user/player/subject for a study id and a participant id before they can begin.  When running locally you can use any study id and participant id.

Build the project and launch the task locally in a browser tab.
```
npm run start:browser
```

If all goes well, you will be able to play through the task using your mouse and keyboard.  At the end of the task, your browser should save a file called `neuro-task.csv` containing all your trial and response data.

Later when deployed and running online, Honeycomb will save task data to an online database after each trial.

## Download participant data from Firebase

Generate a new private key and save locally on computer (follow the last pages of this documentation: https://docs.google.com/document/d/1Ue31BRLMdYNtldAR0ELXwnpIwgCRdXGrA8noUtZQa3c/edit)

Then you can this command in terminal to download participant data:

npm run firebase:download -- study_name participant_id  

NEW COMMAND
npm run cli

check which command this repo uses (depends on current version of github)

note: Will first need to allow your device to have permissions for firebase downloads


