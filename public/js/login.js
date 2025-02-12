const submit = async function( event, where ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    //console.log(where)

    //const entry_1 = document.querySelector( '[name="entry"]:checked')

    /*const entry_2 = document.querySelector( "#entry_2"),
        json_entry_2 = { entry_2: entry_2.value },
        entry_2_body = JSON.stringify( json_entry_2 )*/

    const form = event.target.closest('form');

    if (form.checkValidity()) {
        event.preventDefault();
        const username = document.querySelector( "#username")

        const password = document.querySelector( "#current-password")

        const json = { username: username.value, password: password.value }
        const body = JSON.stringify( json )

        const response = await fetch( "/login/password", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body
        }).then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                console.log('Login failed');
            }
        })
            .catch(err => {
                console.error('Error:', err);
            });
        console.log('Form is valid.');
    } else {
        console.log('Form is invalid.');
    }

}

const signup = async function( event, where ) {
    const form = event.target.closest('form');

    if (form.checkValidity()) {
        event.preventDefault();
        const username = document.querySelector( "#username")

        const password = document.querySelector( "#current-password")

        const json = { username: username.value, password: password.value }
        const body = JSON.stringify( json )

        const response = await fetch( "/signup", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body
        }).then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                console.log('Login failed');
            }
        })
            .catch(err => {
                console.error('Error:', err);
            });
        console.log('Form is valid.');
    } else {
        // If the form is invalid, the browser will show the validation bubbles
        console.log('Form is invalid.');
    }
}

window.onload = function() {
    const where = "this"
    const button = document.querySelector("#loginbutton");
    const signbutton = document.querySelector("#signupbutton");
    button.onclick = (event) => submit(event, where);
    signbutton.onclick = (event) => signup(event, where);
}