const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#username')
const sCpf = document.querySelector('#usercpf')
const sEndereco = document.querySelector('#userendereco')
const sEmail = document.querySelector('#useremail')
const sPassword = document.querySelector('#userpassword')
const sTipo = document.querySelector('#usertipo')
const btnSalvar = document.querySelector('#createButton')
var User = Parse.Object.extend("User");

let itens
let id



    // Initialize Parse
    Parse.initialize("l6d6YdXjcrV1ONGJ6wD74Bn0za7zu5SfzS8Rxpv6", "Ay2E0UL8WoMHyyGIuPlGIue63L4H8Q6aN45cpi6O"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";


//INSERIR NO BACK4

async function createParseUser() {
  // Creates a new Parse "User" object, which is created by default in your Parse app
  let user = new Parse.User();
  // Set the input values to the new "User" object
  user.set("username", document.getElementById("username").value);
  user.set("CPF", document.getElementById("usercpf").value);
  user.set("Endereco", document.getElementById("userendereco").value);
  user.set("email", document.getElementById("useremail").value);
  user.set("password", document.getElementById("userpassword").value);
  user.set("Tipo", document.getElementById("usertipo").value);
  try {
    // Call the save method, which returns the saved object if successful
    user = await user.save();
    if (user !== null) {
      // Notify the success by getting the attributes from the "User" object, by using the get method (the id attribute needs to be accessed directly, though)
      alert(
        `Usuário incluído com sucesso: ${
          user.id
        }, ${user.get("username")}`
      );
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Add on click listener to call the create parse user function
document.getElementById("createButton").addEventListener("click", async function () {
  createParseUser();
});

//MODAL

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sCpf.value = itens[index].cpf
    sEndereco.value = itens[index].endereco
    sEmail.value = itens[index].email
    sPassword.value = itens[index].password
    sTipo.value = itens[index].tipo
    id = index
    

  } else {
    sNome.value = ''
    sCpf.value = ''
    sEndereco.value = ''
    sEmail.value = ''
    sPassword.value = ''
    sTipo.value = ''
  }
  
}


// EDITAR NA LISTA SITE

function editItem(index) {
  openModal(true, index)
}

// EDITAR NO BACK4

async function updatePlayer() {
  //Retrieve your Parse Object
  const user = new Parse.Object("User");

  //set the object
  user.set('CPF',itens[index].cpf);
  //define the new values
  user.path("username", document.getElementById("username").value);
  user.path("CPF", document.getElementById("usercpf").value);
  user.path("Endereco", document.getElementById("userendereco").value);
  user.path("email", document.getElementById("useremail").value);
  user.path("password", document.getElementById("userpassword").value);
  user.path("Tipo", document.getElementById("usertipo").value);

  try{
      //Save the Object
      let result = await user.save();
      alert('Dados atualizados!');
  }catch(error){
      alert('Falha ao atualizar os dados - Cód: ' + error.message);
  }
} 


// DELETAR NA LISTA SITE

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  deletePlayer()
  loadItens()
  
}

// DELETAR NO BACK4

async function deletePlayer() {
  //Retrieve your Parse Object
  const user = new Parse.Object("User");
  //set its objectId
  user.set('CPF',itens[index].cpf);
  alert (user.set);
  try{
      //destroy the object
      let result = await user.destroy();
      alert('Usuário deletado!' + result.id);
  }catch(error){
      alert('Falha ao deletar o usuário - Cód: ' + error.message);
  }
} 

// INSERIR NA LISTA SITE

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.cpf}</td>
    <td>${item.endereco}</td>
    <td>${item.email}</td>

    <td>${item.tipo}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

// BOTÃO

btnSalvar.onclick = e => {
  
  if (sNome.value == '' || 
      sCpf.value == '' || 
      sEndereco.value == '' || 
      sEmail.value == '' ||
      sPassword.value == '' ||
      sTipo.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].cpf = sCpf.value
    itens[id].endereco = sEndereco.value
    itens[id].email = sEmail.value
    itens[id].password = sPassword.value
    itens[id].tipo = sTipo.value
  } else {
    itens.push({'nome': sNome.value, 'cpf': sCpf.value, 'endereco': sEndereco.value, 'email': sEmail.value, 'password': sPassword.value,'tipo': sTipo.value})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

// CARREGAR LISTA NO SITE

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()