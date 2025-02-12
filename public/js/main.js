// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event, where ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault();

    let name = ''

    await fetch('/api/get-username')
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                name = data.username;
                console.log('Logged in as:', data.username);
            } else {
                console.log('Not logged in');
            }
        })
        .catch(err => console.error('Error fetching username:', err));

    const gamename = document.querySelector( "#gamename")

    const playtime = document.querySelector( "#playtime")

    const startdate = document.querySelector( "#startdate")

    const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/(20[0-9]{2})$/;
    if (!pattern.test(startdate.value)){
        alert("Date is in the wrong format.");
        return false;
    }
    if (gamename.value === '' || playtime.value === ''){
        alert("Not all fields are filled out.")
        return false;
    }

    const startTime = new Date(startdate.value);
    const currentTime = Date.now()

    console.log(startTime)
    console.log(currentTime)
    if (startTime >= currentTime && currentTime - startTime <= 100){
        alert("Date is in the future.")
        return false;
    }

    const json = { name: name, gamename: gamename.value, playtime: playtime.value, startdate: startdate.value }
    const body = JSON.stringify( json )

    console.log(body);
    const response = await fetch( "/submit", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body
    })
    const results = await response.json();

    const data = results.insertedData
    console.log( "text:", data )
    if (data === "NameError"){
        alert("Name is already in use.")
        return false;
    }

    let table = document.getElementById("datatable")
    let extraRow = table.insertRow(table.rows.length)
    let buttonCell = extraRow.insertCell(0)
    buttonCell.innerHTML = '<button id="updateButton" type="button" class="nes-btn is-warning">Update</button> <button id="deleteButton" type="button" class="nes-btn is-error">Delete</button></th>';
    extraRow.insertCell(1).innerHTML = data.name;
    extraRow.insertCell(2).innerHTML = data.gamename;
    extraRow.insertCell(3).innerHTML = data.playtime;
    extraRow.insertCell(4).innerHTML = data.startdate;
    extraRow.insertCell(5).innerHTML = data.hours;

    let updateButton = buttonCell.querySelector("#updateButton")
    updateButton.addEventListener('click', function(event) {
        updateData(event, this);
    });

    let deleteButton = buttonCell.querySelector("#deleteButton")
    deleteButton.addEventListener('click', function(event) {
        deleteData(event, this);
    });

    let p = document.createElement("p");
    p.innerHTML = "You've spent " + JSON.parse(data).hours + " hours a day on " + data.gamename;
    document.getElementById("results").innerHTML = p.innerHTML;
    document.getElementById("resultsHeader").style.visibility='visible'

    clear()
}

const updateData = async function(event, where){
    event.preventDefault()
    let row = where.parentNode.parentNode;

    let name = ''

    await fetch('/api/get-username')
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                name = data.username;
                console.log('Logged in as:', data.username);
            } else {
                console.log('Not logged in');
            }
        })
        .catch(err => console.error('Error fetching username:', err));

    if (!(name === row.cells.innerHTML)){
        alert("This entry was not made by you.");
        return;
    }

    const gamename = document.querySelector( "#gamename")
    const playtime = document.querySelector( "#playtime")
    const startdate = document.querySelector( "#startdate")

    const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/(20[0-9]{2})$/;
    if (!pattern.test(startdate.value)){
        alert("Date is in the wrong format.");
        return false;
    }
    if (gamename.value === '' || playtime.value === ''){
        alert("Not all fields are filled out.")
        return false;
    }

    const startTime = new Date(startdate.value);
    const currentTime = Date.now()

    console.log(startTime)
    console.log(currentTime)
    if (startTime >= currentTime && currentTime - startTime <= 100){
        alert("Date is in the future.")
        return false;
    }

    const jsonOld = { name: row.cells[1].innerHTML, gamename: row.cells[2].innerHTML, playtime: row.cells[3].innerHTML, startdate: row.cells[4].innerHTML, hours: Number(row.cells[5].innerHTML) };

    const jsonNew = { name: name, gamename: gamename.value, playtime: playtime.value, startdate: startdate.value }
    const jsonTotal = {jsonOld: jsonOld, jsonNew: jsonNew}
    const body = JSON.stringify( jsonTotal )

    console.log(body);
    const response = await fetch( "/update", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body
    })
    const results = await response.json();

    const data = results.insertedData
    console.log( "text:", data )
    if (data === "NameError"){
        alert("Name is already in use.")
        return false;
    }

    row.cells[1].innerHTML = data.name;
    row.cells[2].innerHTML = data.gamename;
    row.cells[3].innerHTML = data.playtime;
    row.cells[4].innerHTML = data.startdate;
    row.cells[5].innerHTML = data.hours;

    let p = document.createElement("p");
    p.innerHTML = "You've spent " + data.hours + " hours a day on " + data.gamename;
    document.getElementById("results").innerHTML = p.innerHTML;
    document.getElementById("resultsHeader").style.visibility='visible'

    clear()
}

const deleteData = async function(event, where){
    event.preventDefault()

    let row = where.parentNode.parentNode;

    let name = ''

    await fetch('/api/get-username')
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                name = data.username;
                console.log('Logged in as:', data.username);
            } else {
                console.log('Not logged in');
            }
        })
        .catch(err => console.error('Error fetching username:', err));

    if (!(name === row.cells.innerHTML)){
        alert("This entry was not made by you.");
        return;
    }

    if (!(name === row.cells.innerHTML)){
        alert("This entry was not made by you.");
        return;
    }

    const jsonOld = { name: row.cells[1].innerHTML, gamename: row.cells[2].innerHTML, playtime: row.cells[3].innerHTML, startdate: row.cells[4].innerHTML, hours: Number(row.cells[5].innerHTML) };

    const body = JSON.stringify( jsonOld )

    const response = await fetch( "/delete", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body
    })
    const results = await response.json();

    row.parentNode.removeChild(row)

    alert("Entry Deleted")
}

const signOut = async function(event, where) {

    const response = await fetch( "/signout", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    alert("Signed Out")
}

function clear(){
    document.getElementById("yourname").value = "";
    document.getElementById("gamename").value = "";
    document.getElementById("playtime").value = "";
    document.getElementById("startdate").value = "";
}

window.onload = function() {
    const where = "this"
    const button = document.querySelector("#submitbutton");
    button.onclick = (event) => submit(event, where);

    const signoutbutton = document.querySelector("#signoutbutton");
    signoutbutton.onclick = (event) => signOut(event, where);

    let table = document.getElementById("datatable")
    if (table.rows.length > 0){
        for (let i = 1, row; row = table.rows[i]; i++) {
            console.log("ran through");
            let buttonCell = row.cells[0];
            let updateButton = buttonCell.querySelector("#updateButton")
            updateButton.addEventListener('click', async function(event) {
                await updateData(event, this);
            });
            let deleteButton = buttonCell.querySelector("#deleteButton")
            deleteButton.addEventListener('click', async function(event) {
                await deleteData(event, this);
            });
        }
    }
    document.getElementById("resultsHeader").style.visibility='hidden'
}
