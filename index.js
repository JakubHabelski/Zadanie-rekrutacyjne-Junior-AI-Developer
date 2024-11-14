import OpenAI from 'openai';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require('fs');

const openai = new OpenAI({
  
});



let file;
try {
    file = fs.readFileSync('tresc_artykulu.txt', 'utf8');
   
} catch (err) {
    console.error("Error reading file:", err);
}
let prompt = "Obrób dostarczony przeze mnie artykuł: " + file + "/n Tam gdzie uznasz to za stosowne dodaj miejsce gdzie można dodać grafiki. Zrób to poprzez dodanie tagu html <img> z atrybutem src='image_placeholder.jpg' Dodaj atrybut alt do każdego obrazka z dokładnym promptem, który możemy użyć do wygenerowania grafiki. Umieść podpisy pod grafikami używając odpowiedniego tagu HTML. Użyk odpowiednich tagów HTML do strukturyzacji treści. Nie używaj CSS ani JS Zwrócony kod powinien zawierać wyłącznie zawartość do wstawienia pomiędzy tagami <body> i </body>. Nie dołączaj znaczników <html>,<head> ani <body>.";

let create_response_prompt = function(file_name){
    try{
       return fs.readFileSync(file_name, 'utf-8');
    } catch(err) {
        console.error("Error reading file:", err);
        return null;
    }
}
let template_response_prompt = create_response_prompt('template_generate_prompt.txt');
let preview_response_prompt = create_response_prompt('preview_generate_prompt.txt');
    

function save_to_file(response, file_name){
    fs.writeFile(file_name, response, (err) =>{
        if(err){
            console.error("Blad w zapisie: ", err);
        } else{
            console.log("Pomyslnie zapisano plik: ", file_name);
        }
    });
}


const runPrompt = async () => {
    

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{"role": "user", "content": prompt}]
    });
    save_to_file(response.choices[0].message.content, "artykul.html");
    const create_template_response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{"role": "user", "content": template_response_prompt}]
    })
    save_to_file(create_template_response.choices[0].message.content, "szablon.html");
    const create_preview_response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{"role": "user", "content": preview_response_prompt}]
    })
    save_to_file(create_preview_response.choices[0].message.content, "podglad.html");

   
    
};

runPrompt();
