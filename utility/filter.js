export const filterbySearch=(data,fil)=>{
    var a = data.filter(item =>
           item.name.toString().toLowerCase().startsWith(fil.toString().toLowerCase())     
   )
   return a;
}