function checkForIndexedDb() {
  if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB.");
    return false;
  }
  return true;
}

function useIndexedDb(databaseName, storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 1);
    let db,
      tx,
      store;

    request.onupgradeneeded = function (e) {
      console.log('dbopen on upgraded')

      const db = request.result;
      // console.log('mykey'+object.json())
      // const mykey = databaseName+storeName+method
      db.createObjectStore(storeName, { keyPath: "_id" });
    };

    request.onerror = function (e) {
      console.log('dbopen on error')

      console.log("There was an error");
    };

    request.onsuccess = function (e) {
      console.log('dbopen on success')
      db = request.result;
      tx = db.transaction(storeName, "readwrite");
      store = tx.objectStore(storeName);

      db.onerror = function (e) {
        console.log("error");
      };
      if (method === "put") {
        console.log(JSON.stringify(object))
        for (let k = 0; k <= object.length - 1; k++) {
          let mykey = object[k]._id;
          console.log('mykey:' + mykey)
          store.put(object[k]);
        }
      } else if (method === "get") {
        const all = store.getAll();
        all.onsuccess = function () {
          resolve(all.result);
        };
      } else if (method === "delete") {
        store.delete(object._id);
      }
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
