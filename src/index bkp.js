import cors from 'cors';

//importar lib axios (Permite realizar requisicoes para fora do projeto atraves de request)
const axios = require('axios');


class app{
    constructor(){
        this.btn_login = document.getElementById("btn_access");
        this.email = document.getElementById("email");
        this.password = document.getElementById("password");
        this.url = 'http://localhost:3333/cards/';
        this.accessPage();
    }

    accessPage() {
        this.btn_login.onclick = (event) => this.checkFields(event);
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
        
        axios.post('http://localhost:3334/login', {
            email: this.email.value,
            password: this.password.value

        })
        .then(function (response) {
            // console.log(response);
            // console.log(response.token);
            //Recebe o TOKEN p/ usar na AUTENTICACAO
            const {token} = response.data;
            console.log(token);

            app.clearForm();
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
        const AuthStr = 'Bearer '.concat(USER_TOKEN)
        
        // axios.get('http://localhost:3334/test', {
        //     token: this.token

        // })
        axios.get('http://localhost:3334/test', 
            { headers: { Authorization: AuthStr } })
        
            .then(function (response) {
            console.log(response);

            const {data} = response;
            console.log(data);
            if(data == 'Authenticaded'){
                // window.location.href = "http://localhost:8080/cards.html";
                window.open("http://localhost:8080/cards.html");
            }

            // console.log(response.token);
            //Recebe o TOKEN p/ usar na AUTENTICACAO
            // const {token} = response.data;
            // console.log(token);

            // app.clearForm();

        })
        .catch(function (error) {
            console.log(error);
            alert("Ops!");
        })
        .finally(function () {
        });
    }

    clearForm() {
        this.email.value = "";
        this.password.value = "";
    }
}



new app();
