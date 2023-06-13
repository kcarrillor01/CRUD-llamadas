const firebaseConfig = {
    /*apiKey: "AIzaSyBFyQXP99eBMj0sQuABfcr7sHQn51ywE7U",
    authDomain: "arkitask2.firebaseapp.com",*/
    databaseURL: "https://formulario-73b0d-default-rtdb.firebaseio.com/",
    /*projectId: "arkitask2",
    storageBucket: "arkitask2.appspot.com",
    messagingSenderId: "558206073756",
    appId: "1:558206073756:web:aa50c3e2f4d341fbcde659",
    measurementId: "G-1KM9F1VB5F"*/
    
};


  firebase.initializeApp(firebaseConfig);

const openModal = document.getElementById('openRegister');
const modal = document.getElementById('modal');

const updateModal = document.getElementById('modal-update')
const updateForm = document.getElementById('update-form');
const closeUpdateModal = document.getElementById('closeUpdateModal')

const closeModal = document.getElementById('closeRegisterModal');
const registerForm = document.getElementById('register-form');
const studentRef = firebase.database().ref('usuarios');
const studentData = document.getElementById('studentsTable');


const showRegisterModal = () => {
    modal.classList.toggle('is-active')
}

openModal.addEventListener('click', (showRegisterModal))
closeModal.addEventListener('click', (showRegisterModal))


const deleteStudent = (uid) => {
    firebase.database().ref(`usuarios/${uid}`).remove()
}

const showUpdateModal = () => {
    updateModal.classList.toggle('is-active')
}

closeUpdateModal.addEventListener('click', showUpdateModal)

window.addEventListener('DOMContentLoaded', async (e) => {
    await studentRef.on('value', (users) => {
        studentsTable.innerHTML = ''
        users.forEach((student) =>{
            let studentData = student.val()
            studentsTable.innerHTML += `
            <tr>
                <td>${studentData.Nombre}</td>
                <td>${studentData.NumeroPropietario}</td>
                <td>${studentData.NumeroOtraLinea}</td>
                <td>
                    <button class="button is-warning" data-id="${studentData.Uid}">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="button is-danger" data-id="${studentData.Uid}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
            `
            const updateButtons = document.querySelectorAll('.is-warning')
            updateButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    showUpdateModal()
                    firebase.database().ref(`usuarios/${e.target.dataset.id}`).once('value').then((student) =>{
                        const data = student.val()
                        updateForm['nombre'].value = data.Nombre
                        updateForm['numPro'].value = data.NumeroPropietario
                        updateForm['numLla'].value = data.NumeroOtraLinea
                    })
                    const uid = e.target.dataset.id
                    updateForm.addEventListener('submit', (e) => {
                        e.preventDefault()

                        const nombre = updateForm['nombre'].value
                        const numPro = updateForm['numPro'].value
                        const numLla = updateForm['numLla'].value
                    
                        firebase.database().ref(`usuarios/${uid}`).update({
                            Nombre: nombre,
                            NumeroPropietario: numPro,
                            NumeroOtraLinea: numLla,
                        })
                        showUpdateModal()
                    })
                })
            })

            const deleteButtons = document.querySelectorAll('.is-danger')
            deleteButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    deleteStudent(e.target.dataset.id)
                })
            })
        }) 
    })
})

registerForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const nombre = registerForm['nombre'].value
    const numPro = registerForm['numPro'].value
    const numLla = registerForm['numLla'].value

    const registerStudent = studentRef.push()
    registerStudent.set({
        Uid: registerStudent._delegate._path.pieces_[1],
        Nombre: nombre,
        NumeroPropietario: numPro,
        NumeroOtraLinea: numLla,
    })
    showRegisterModal()
});