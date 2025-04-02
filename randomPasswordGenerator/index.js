let lengthSlider=document.querySelector('#length-slider');
let sliderValue=document.querySelector('#slider-value');

sliderValue.textContent=lengthSlider.value;


lengthSlider.addEventListener('input',()=>{
    sliderValue.textContent=lengthSlider.value;
});

let checkboxes=document.querySelectorAll('.checkbox');

Array.from(checkboxes).forEach(Element=>{
    Element.addEventListener('click',(e)=>{
        if(e.target.innerText=='radio_button_unchecked'){
            e.target.innerText='task_alt'
            e.target.nextElementSibling.nextElementSibling.checked=true
        }else{
            e.target.innerText='radio_button_unchecked';
            e.target.nextElementSibling.nextElementSibling.checked=false;
        }
    })
});

let includeLabels=document.querySelectorAll('.row label');

Array.from(includeLabels).forEach(element=>{
    element.addEventListener('click',(e)=>{
        if(e.target.previousElementSibling.innerText=='radio_button_unchecked'){
            e.target.previousElementSibling.innerText='task_alt'
        }else{
            e.target.previousElementSibling.innerText='radio_button_unchecked'
        }
    })
});

let generateBtn=document.querySelector('#generate-btn');
let password=document.querySelector('#password');

generateBtn.addEventListener('click',()=>{
    let length=lengthSlider.value;

    let uppercase=document.querySelector('#uppercase').checked;
    let lowercase=document.querySelector('#lowercase').checked;
    let symbols=document.querySelector('#symbols').checked;
    let numbers=document.querySelector('#numbers').checked;

    let password_generated=generatePassword(length,uppercase,lowercase,symbols,numbers);
    password.value=password_generated;
})

function generatePassword(length,uppercase,lowercase,symbols,numbers){
    let charset="";
    let string="";
    if(uppercase){
        charset+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if(lowercase){
        charset+="abcdefghijklmnopqrstuvwxyz";
    }
    if(symbols){
        charset+="!@#$%^&*()?/|}[{]";
    }
    if(numbers){
        charset+="0123456789";
    }

    // math.random()->[0,1)

    for(let i=0;i<length;i++){
        string+=charset.charAt(Math.floor(Math.random()*charset.length));
    }

    return string;
}

let copyIcon=document.querySelector('#copy-icon');

copyIcon.addEventListener('click',()=>{
    if(password.value!=''){
        navigator.clipboard.writeText(password.value);
        copyIcon.innerText='check';

        setTimeout(()=>{
            copyIcon.innerText='content_copy'
        },4000)
    } 
})