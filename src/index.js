//importar lib axios (Permite realizar requisicoes para fora do projeto atraves de request)
const axios = require('axios');


class App {
    constructor(){
        this.home();
    }

    home() {
        let urlCards = 'http://localhost:8080/cards.html';
        if(urlCards == window.location.href){
            console.log('CARD');
            this.buttonCreate = document.getElementById("btn_create");
            this.buttonEdit = document.getElementById("btn_edit");
            this.title = document.getElementById("input_title");
            this.content = document.getElementById("input_content");
            //URLs de acessos
            // this.url = 'https://api-scrapbook-js-es6.herokuapp.com/cards';
            // this.url = 'http://localhost:3334/cards/';
            this.url = 'http://localhost:3000/cards/';

            //Trazer os recados ao iniciar a aplicacao
            this.getScraps(this); //O THIS passa a aplicação correta
            this.registerEvents();
        }else{
            this.btn_login = document.getElementById("btn_access");
            this.email = document.getElementById("email");
            this.password = document.getElementById("password");
            this.accessPage();
        }
    }

    accessPage() {
        this.btn_login.onclick = (event) => this.checkFields(event);
        console.log(window.location.href);
    }

    checkFields(event){
        event.preventDefault();
        if(this.email.value && this.password.value){
            console.log("Campos preenchidos");
            this.sendToLogin(this);
        } else {
            alert("Preencha os campos!");
        }
    }

    sendToLogin(app) {
        
        axios.post('http://localhost:3000/login', {
            email: this.email.value,
            password: this.password.value

        })
        .then(function (response) {
            // console.log(response);
            // console.log(response.token);
            //Recebe o TOKEN p/ usar na AUTENTICACAO
            const {token} = response.data;
            console.log(token);

            app.clearFormLogin();
            app.sendToAutentic(token);

        })
        .catch(function (error) {
            console.log(error);
            alert("Ops! Tente novamente mais tarde.");
        })
        .finally(function () {
        });
    }


    sendToAutentic(token) {

        const USER_TOKEN = token;
        const AuthUserString = 'Bearer '.concat(USER_TOKEN)
        
        axios.get('http://localhost:3000/test', 
            { headers: { Authorization: AuthUserString } })
        
            .then(function (response) {
            console.log(response);

            const {data} = response;
            console.log(data);

            if(data == 'Authenticaded'){
                window.location.href = "http://localhost:8080/cards.html";
                // saveListStorage(AuthUserString);
                // sessionStorage.setItem('token',res.data.token);
                // sessionStorage.getItem('token',AuthUserString);
                sessionStorage.setItem('token',AuthUserString);
            }

        })
        .catch(function (error) {
            console.log(error);
            alert("Ops! Autenticação!");
        })
        .finally(function () {
        });
    }

    clearFormLogin() {
        this.email.value = "";
        this.password.value = "";
    }


    registerEvents() {
        this.buttonCreate.onclick = (event) => this.createCard(event);
        // this.buttonEdit.onclick = (event) => this.editCard(event);
    }


    // LINK HEROKU
    // https://api-scrapbook-js-es6.herokuapp.com/

    // LINK POSTMAN
    // http://localhost:3333/cards/

    editCard(event){
        console.log(event);
        var button = this.buttonEdit; // Botão que acionou o modal
        
    }

    // Funcao p/ pegar os RECADOS/CARDS (GET). APP é o nome criado p/ o THIS do construtor
    getScraps(app){
        // const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTc4NzA3NjUxLCJleHAiOjE1Nzg3OTQwNTF9.1FWSmeeQRPLXoXDdIevHK591rdT5TCwb1lyvAq5o1ok';
        // const AuthUserString = 'Bearer '.concat(USER_TOKEN)
        // // sessionStorage.getItem('token');
        // console.log(AuthUserString);

        //Pegar a constante e fazer as chamadas do POSTMAN (API Node)
        axios.get(this.url, 
            { headers: { Authorization: sessionStorage.getItem('token') } })

        .then(function(response){
            // console.log(app);

            //Passando o DATA p/ a funcao recoveryScraps
            app.recoveryScraps(response.data);
        })
        .catch(function(error){
            console.log(error);
        })
        .finally(function(){

        });
    }

    //quando executar o THEN do getScraps, vai passar o DATA pro recoveryScraps
    recoveryScraps(data){
        // //Retorna o array de objetos (cards)
        // console.log(data);
        //Percorre o array de objetos (cards)
        for(item of data){ //dentro de ITEM há as propriedades ID, TITLE e CONTENT
            
            //Reaproveitar as funcoes que possuem as mesmas propriedades de ITEM
            const retornaHtml = this.cardLayout(item.id, item.title, item.content);

            // //Testando se o html esta sendo retornado
            // console.log(retornaHtml);

            //Inserir o HTML no front
            this.insertHtml(retornaHtml);

            document.querySelectorAll('.edit-card').forEach(item => {
                item.onclick = event => this.editCard(event);
            });

            //Inserir tambem o evendo do botao de DELETAR do card
            document.querySelectorAll('.delete-card').forEach(item => {
                item.onclick = event => this.deleteCard(event);
            });
        }
    }

    createCard(event) {
        event.preventDefault();

        if(this.title.value && this.content.value) {
            this.sendToServer(this);
        } else {
            alert("Preencha os campos!");
        }
    }
    
    sendToServer(app) {

        axios.post(this.url, {
            title: this.title.value,
            content: this.content.value
            },
            {
                headers: {
                Authorization: sessionStorage.getItem('token')
                }
            })

        
        .then(function (response) {
            //Recebe o ID, TITLE e CONTENT p/ utilizar no HTML
            const {id, title, content} = response.data;
            console.log(response.data);
            let html = app.cardLayout(id, title, content);

            app.insertHtml(html);

            app.clearForm();

            document.querySelectorAll('.delete-card').forEach(item => {
                item.onclick = event => app.deleteCard(event);
            });

        })
        .catch(function (error) {
            console.log(error);
            alert("Ops! Erro POST no SEND TO SERVER.");
        })
        .finally(function () {
        });
    }

    cardLayout(id, title, content) {
        const html = `
            <div class="col mt-5" scrap="${id}">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${content}</p>
                    <button type="button" class="btn btn-danger delete-card">Excluir</button>
                    <!--Data-toggle / Data-target = modal "alvo" a ser aberto -->
                    <button type="button" class="btn btn-primary edit-card" data-toggle="modal" data-target="#editModal">Editar</button>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    insertHtml(html) {
        document.getElementById("row_cards").innerHTML += html;
    }


    clearForm() {
        this.title.value = "";
        this.content.value = "";
    }

    deleteCard = (event) => {
        const id = event.path[3].getAttribute('scrap');
        
        // axios.delete(this.url + `${id}`)

        axios.delete(this.url + `${id}`, 
            {
                headers: {
                Authorization: sessionStorage.getItem('token')
                }
            })




            .then(function (response) {
                event.path[3].remove();
            })
            
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
            });
    };

}

new App();