const Contato = require('../models/ContatoModel')

exports.index = (req, res) => {
  res.render('contato',{contato:{}});
};
exports.register = async (req, res) => {
  try{
    
    const contato = new Contato(req.body)
    await contato.register();
  
    if(contato.error.length > 0){
      req.flash('error',contato.error)
      return req.session.save(()=>res.redirect('/contato/index')) 
    }
    req.flash('success',"Contato Registrado com sucesso.")
      return req.session.save(()=>res.redirect(`/contato/index/${contato.contato._id}`)) ;

  }catch(e){console.log(e)}
  return res.render('404')
};

exports.editIndex = async function(req,res){
  if(!req.params.id) return res.render('404');

  const contato = await Contato.findID(req.params.id)
  if (!contato)return res.render('404')
  res.render('contato', {contato})
}

exports.edit = async function(req,res){
  try{
    if(!req.params.id) return res.render('404');
    const contato = new Contato(req.body);
    await contato.edit(req.params.id)
  
    if(contato.error.length > 0){
      req.flash('error',contato.error)
      return req.session.save(()=>res.redirect('/')) 
    }
    req.flash('success',"Contato Registrado com sucesso.")
      return req.session.save(()=>res.redirect(`/contato/index/${contato.contato._id}`)) ;

  }catch(e){
    console.log(e);
    return res.render('404');
  }

}

exports.delete = async (req,res)=>{
  if(!req.params.id) return res.render('404');

  const contato = await Contato.delete(req.params.id);
  if(!contato) return res.render('404');

  req.flash('success',"Contato excluido.")
      return req.session.save(()=>res.redirect('/')) ;

}