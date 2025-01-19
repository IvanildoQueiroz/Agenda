const mongoose = require('mongoose');
const validator = require('validator');

const contatoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true},
  cellphone: { type: String, required: true },
  email: { type: String, required: true },
  createIn: { type: Date,default:Date.now },
  
});

const contatoModel = mongoose.model('contato', contatoSchema);

function Contato(body){
  this.body = body;
  this.error = [];
  this.contato = null;
}

Contato.findID = async (id)=>{
  if(typeof id !== 'string') return;
  const user = await contatoModel.findById(id);
  return user;
}

Contato.prototype.register = async function(){
  this.valided();
  if(this.error.length > 0) return;
  this.contato = await contatoModel.create(this.body);
}

  Contato.prototype.valided = function() {
     this.cleanUp()
      //validação
      // o e-mail precisa ser valido
      if (this.body.email && !validator.isEmail(this.body.email)) this.error.push("e-mail invalido");
      if(!this.body.name)this.error.push('Nome é um campo obrigatorio !');
      if(!this.body.email && !this.body.cellphone)this.error.push('Necessário nome e telefone');

    }
    Contato.prototype.cleanUp = function() {
      for (const key in this.body) {
        if (typeof this.body[key] !== "string") {
          this.body[key] = "";
        }
      }
      this.body = {
        name: this.body.name,
        surname: this.body.surname,
        email: this.body.email,
        cellphone: this.body.cellphone,
        
      };
    }
    Contato.prototype.edit = async function(id){
      if(typeof id !== 'string') return
      this.valided()
      if(this.error.length >0) return;
      this.contato = await contatoModel.findByIdAndUpdate(id,this.body, {new:true})

    }



    //methods statics

    Contato.findID = async (id)=>{
      if(typeof id !== 'string') return;
      const contato = await contatoModel.findById(id);
      return contato;
    }
    Contato.findContacts = async ()=>{
     
      const contatos = await contatoModel.find()
      .sort({createIn: -1});
      return contatos;
    }
    Contato.delete = async (id)=>{
      if(typeof id !== 'string') return;
      const contato = await contatoModel.findByIdAndDelete({_id:id});
      return contato;
    }
module.exports = Contato;
