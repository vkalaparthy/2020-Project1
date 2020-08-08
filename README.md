## Dream Dog

Find your dream dog in your state or discover a surprise dog in your state using the Surprise Me feature.

## Table of contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Features](#features)
* [How to Use](#how-to-use)

## General Info

An application that runs in a browser and features dynamically updated HTML, CSS, and JavaScript. Utilizes The Dog API and PetFinder API to allow a user to search for dogs in a selected state by either inputting a breed type or both a breed group and temperament. Users may alternatively select "Surpise Me" and a state to find a random dog.

## Technologies

* The Dog API
* PetFinder API
* Bootstrap 4.5
* jQuery
* Font Awesome

## Features

* Pulls dog breeds, information, and pictures from The Dog API
* Searches for selected breeds in specified state using PetFinder API
* Provides a link to the available dogs in PetFinder in the selected state

## How to Use

* The application has multiple options for searching for a dog: 1. Selecting a state and breed type, 2. Selecting a state, breed group and/or temperament, or 3. Selecting a state and Surprise Me.

* Option 1: Upon entering the application, select a state, then type in a specific breed group (ex. Golden Retriever, Boxer, Bulldog, etc) and press the Submit button.
    * If a state or breed group is not selected, the user will receive an error message asking that they make the selection(s).

* Option 2: Upon entering the application, select a state, then select a breed type and/or temperment, and press the Submit button.
    * If a state, breed type, and/or temperament is not selected, the user will receive an error message asking that they make the selection(s).

* Option 3: Upon entering the application, select a state and then press the Surprise Me button.
    * If a state is not selected, the user will receive an error message asking that they make the selection.

* After performing one of the three options, one or more cards will appear, each with a picture of and information about a breed group.

* In each card will be a Select Me button. Choosing this button will cause dogs to appear in the Available Dogs box.
    * If the selected breed group is not available in the state chosen from the dropdown, an error message saying, "Breed group is not available in selected state. Please search again" will appear.

* If the user would like to perform a new search or select new fields, they may use the Clear button to empty all of the fields and remove any breed groups that may have appeared.

