// import axios from 'axios';

// const URL = 'https://jsonplaceholder.typicode.com/users';

// let btn = document.querySelector('#btn');
// let para = document.querySelector('#para');

// // btn.addEventListener('click', function () {
// //     const xhr = new XMLHttpRequest();

// //     xhr.onreadystatechange = () => {
// //         para.innerHTML = xhr.response;
// //     }

// //     xhr.open('GET', URL);
// //     xhr.send();
// // })

// // btn.addEventListener('click', function () {
// //     fetch(URL)
// //         .then(response => response.json())
// //         .then(data => {
// //             data.forEach(user => {
// //                 para.innerHTML = `${para.innerHTML} </br> Name: ${user.name}`
// //             })
// //         })
// //         .catch(err => console.log(err));
// // })

// btn.addEventListener('click',function(){
//     axios.get(URL)
//         .then(response => {
//             response.data.forEach(user => {
//                 para.innerHTML = `${para.innerHTML} </br> Name: ${user.name}`
//             })
//         })
//         .catch(err => console.log(err))
// })




import axios from 'axios';

const BASE_URL = 'http://localhost:3000/contacts';

const tbody = document.querySelector('tbody')

window.onload = function () {
    //  get all data from server
    axios.get(BASE_URL)
        .then(response => {
            response.data.forEach(contact => {
                createTDElement(contact, tbody)
            })
        })
        .catch(err => console.log(err));

    // add new data into server
    const btn = document.querySelector('#btn');
    btn.addEventListener('click', function () {
        createNewData();
        let alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.setAttribute('id', 'saveAlert');
        alertDiv.innerHTML = 'New Contact Added';

        let h1 = document.querySelector('#h1');
        h1.appendChild(alertDiv);

        setTimeout(function () {
            document.querySelector("#saveAlert").style.display = "none";
        }, 2000);
    })
}

function createNewData() {
    const name = document.querySelector('#name');
    const phone = document.querySelector('#phone');
    const email = document.querySelector('#email');
    const tbody = document.querySelector('#tbody');

    let contact = {
        name: name.value,
        phone: phone.value,
        email: email.value
    }

    axios.post(BASE_URL, contact)
        .then(response => {
            createTDElement(response.data, tbody);
            name.value = '';
            phone.value = '';
            email.value = '';
        })
        .catch(err => console.log(err));
}

function createTDElement(contact, parent) {

    const TR = document.createElement('tr');

    const TdName = document.createElement('td');
    TdName.innerHTML = contact.name;
    TR.appendChild(TdName);

    const TdPhone = document.createElement('td');
    TdPhone.innerHTML = contact.phone ? contact.phone : 'N/A';
    TR.appendChild(TdPhone);

    const TdEmail = document.createElement('td');
    TdEmail.innerHTML = contact.email ? contact.email : 'N/A';
    TR.appendChild(TdEmail);

    const TdAction = document.createElement('td');

    const TdEditBtn = document.createElement('button');
    TdEditBtn.className = 'btn btn-warning btn-sm mx-1';
    TdEditBtn.innerHTML = 'Edit';
    TdEditBtn.addEventListener('click', function () {
        let mainModal = $('#editModal');
        mainModal.modal('toggle');

        let editName = document.querySelector('#edit-name');
        let editPhone = document.querySelector('#edit-phone');
        let editEmail = document.querySelector('#edit-email');

        editName.value = contact.name;
        editPhone.value = contact.phone ? contact.phone : '';
        editEmail.value = contact.email ? contact.email : '';

        let updateBtn = document.querySelector('#update-contact');
        updateBtn.addEventListener('click', function () {
            axios.put(`${BASE_URL}/${contact.id}`, {
                    name: editName.value,
                    phone: editPhone.value,
                    email: editEmail.value
                })
                .then(response => {
                    TdName.innerHTML = response.data.name;
                    TdPhone.innerHTML = response.data.phone;
                    TdEmail.innerHTML = response.data.email;

                    mainModal.modal('hide');

                    let alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-success';
                    alertDiv.setAttribute('role', 'alert');
                    alertDiv.setAttribute('id', 'updateAlert');
                    alertDiv.innerHTML = 'Contact Updated';

                    let h1 = document.querySelector('#h1');
                    h1.appendChild(alertDiv);

                    setTimeout(function () {
                        document.querySelector("#updateAlert").style.display = "none";
                    }, 2000);
                })
                .catch(err => console.log(err))
        })

    })
    TdAction.appendChild(TdEditBtn);

    const TdDeleteBtn = document.createElement('button');
    TdDeleteBtn.className = 'btn btn-danger btn-sm';
    TdDeleteBtn.innerHTML = 'Delete';
    TdDeleteBtn.addEventListener('click', function () {
        axios.delete(`${BASE_URL}/${contact.id}`)
            .then(response => {
                parent.removeChild(TR);
                let alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success';
                alertDiv.setAttribute('role', 'alert');
                alertDiv.setAttribute('id', 'deleteAlert');
                alertDiv.innerHTML = 'Contact Deleted';

                let h1 = document.querySelector('#h1');
                h1.appendChild(alertDiv);

                setTimeout(function () {
                    document.querySelector("#deleteAlert").style.display = "none";
                }, 2000);
            })
            .catch(err => console.log(err))

    })
    TdAction.appendChild(TdDeleteBtn);

    TR.appendChild(TdAction);

    parent.appendChild(TR)
}