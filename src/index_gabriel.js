//importar lib axios (Permite realizar requisicoes para fora do projeto atraves de request)
const axios = require('axios');


class App {
    constructor(){
        this.buttonCreate = document.getElementById("btn_create");
        // this.buttonEdit = document.getElementById("btn_edit");
        this.title = document.getElementById("input_title");
        this.content = document.getElementById("input_content");
        //URLs de acessos
        // this.url = 'https://api-scrapbook-js-es6.herokuapp.com/cards';
        this.url = 'http://localhost:3333/cards/';
        //Trazer os recados ao iniciar a aplicacao
        this.getScraps(this); //O THIS passa a aplicação correta
        this.registerEvents();
    }

    registerEvents() {
        this.buttonCreate.onclick = (event) => this.createCard(event);
        // this.buttonEdit.onclick = (event) => this.editCard(event);
    }


    // LINK HEROKU
    // https://api-scrapbook-js-es6.herokuapp.com/

    // LINK POSTMAN
    // http://localhost:3333/cards/


    // Funcao p/ pegar os RECADOS/CARDS (GET). APP é o nome criado p/ o THIS do construtor
    getScraps(app){
        //Pegar a constante e fazer as chamadas do POSTMAN (API Node)
        axios.get(this.url)
        .then(function(response){
            // console.log(app);

            //Passando o DATA p/ a funcao recoveryScraps
            app.recoveryScraps(response.data);

            // this.recoveryScraps(response.data);
            // console.log(response.data) //Retorna soh o DATA do objeto
            // console.log(response); //Rerorna todo o objeto
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
        })
        .then(function (response) {
            //Recebe o ID, TITLE e CONTENT p/ utilizar no HTML
            const {id, title, content} = response.data;
            console.log(response.data);
            let html = app.cardLayout(id, title, content);

            app.insertHtml(html);

            app.clearForm();

            document.querySelectorAll('.edit-card').forEach(item => {
                item.onclick = event => app.editCard(event);
            });

            document.querySelectorAll('.delete-card').forEach(item => {
                item.onclick = event => app.deleteCard(event);
            });

        })
        .catch(function (error) {
            console.log(error);
            alert("Ops! Tente novamente mais tarde.");
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
                    <button type="button" class="btn btn-primary edit-card">Editar</button>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    insertHtml(html) {
        document.getElementById("row_cards").innerHTML += html;
    }

    modalLayout(id, title, content){
        let htmlEdit =`<div class="modal fade" scrap="${id} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Nova mensagem</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-group">
                                            <label for="recipient-name" class="col-form-label">Destinatário:</label>
                                            <input type="text" class="form-control" id="recipient-name">
                                            </div>
                                            <div class="form-group">
                                            <label for="message-text" class="col-form-label">Mensagem:</label>
                                            <textarea class="form-control" id="message-text"></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                                    <button type="button" id="btn_edit" class="btn btn-primary">Editar</button>
                                </div>
                            </div>
                            </div>
                        </div>`;
        return htmlEdit;
    }

    insertHtmlEdit(htmlEdit) {
        document.getElementById("row_cards").innerHTML += htmlEdit;
    }

    editCard(event){
        // alert(event);
        console.log(event);
        this.insertHtmlEdit();
        
    }

    


    clearForm() {
        this.title.value = "";
        this.content.value = "";
    }

    deleteCard = (event) => {
        const id = event.path[3].getAttribute('scrap');
        
        axios.delete(this.url + `${id}`)
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