let db;

const request = indexedDB.open("budget", 1);

//stores the pending objects
request.onupgradeneeded = (act) => {
    const db = act.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};


//if it works get the results
request.onsuccess = (act) => {
    db = act.target.result;

    if (navigator.onLine) {
        checkDb();
    }
};

//show the erros
request.onerror = (act) => {
    console.log("What happened!" + act.target.errorCode);
};

//saves the records
function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    store.add(record);
}
//checks the database
function checkDb() {

    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    //gets and posts and then transactions
    getAll.onsuccess = () => {

        if (getAll.result.length > 0) {

            //gets the api transaction and posts it
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
            })

                //waits to pick up the pending transactions
                .then((response) => response.json())
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");
                    const store = transaction.objectStore("pending");
                    store.clear();
                });
        }
    };
}

// listens for app to come online
window.addEventListener("online", checkDatabase);