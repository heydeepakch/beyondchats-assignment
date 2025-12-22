import checkUpdatedExists from "./checkUpdatedExists.js";

async function checkIfUpdated(){
    const article = await checkUpdatedExists(17);
   
    if(article){
        console.log('Updated article exists');
    }else{
        console.log('Updated article does not exist');
    }
}

checkIfUpdated()