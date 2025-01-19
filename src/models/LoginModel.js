const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.error = [];
    this.user = null;
  }
  async login(){
    this.valided()
    if (this.error.length > 0) return;

    this.user = await LoginModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.error.push("usuário não existe");
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.error.push('Senha invalida');
      this.user = null
    }

  }
  async register() {
    this.valided();
    if (this.error.length > 0) return;
    await this.checkUserExist();
    if (this.error.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

      this.user = await LoginModel.create(this.body);
    
  }
  async checkUserExist() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) {
      this.error.push('Usuário já existe')
    }
  }
  valided() {
    this.cleanUp();
    //validação
    // o e-mail precisa ser valido
    if (!validator.isEmail(this.body.email)) this.error.push("e-mail invalido");

    //A senha precisa ter entre 3 e 50 caracteres
    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.error.push("A senha precisa ter entre 3 e 50 caracteres");
    }
  }
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
