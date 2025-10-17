const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema= new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
});
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(this.password, salt);
    this.password=hashedPassword;
    next();
});
userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};
module.exports=mongoose.model('User', userSchema);