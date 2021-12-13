# Budget Tracker App Read me

# Express Use
It root folder it has server.js file which acts as a server for the app
It also has package json file

# public folder
In public folder it has its client part files


# Offline use
![This is an image](https://drive.google.com/file/d/1Eje2-GhD2W31Pr8A3fL6prqx6z1rw41X/view?usp=sharing)

# Service worker -install 
It is for saving files to make it available in offline.
It remembers 'All the file assets in const variable'('FILES_TO_CACHE)
and it has two CACHE Name, one is running and the other is for updating.

# intersaction between index.js and service-worker.js
Noticing api (catching)
public/index.js file

starting the app with fetching to '/api/transaction',

in service-workers.js file in line 50 there is a self.addEventListener("fetch") listener,
it catches '/api/' and it returns 'respondWith' to index.js file.
  -> service worker saves the user input using indexedDb
  -> when user comes to online again, it use this data and input to the database again

# key
Each member of IDBObject has its own key, so app has to handle the key 
put(object) doesn't need a key because it enters its value inline
bue in saveRecord Function is is using its own key (iterates the object)
![This is an image](https://drive.google.com/file/d/1B3q27LioY5cAzjUWexDK7dkAWMDE-c8Y/view?usp=sharing)



