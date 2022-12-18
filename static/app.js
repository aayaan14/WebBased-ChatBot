// const recognition  = new webkitSpeechRecognition();
// recognition.continuous = false;  //only listens till first pause
// recognition.lang = "en-US";
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;
let xx="";
let xxx="";
var textField,sentence,word;
var voice_response;
var c_img = document.getElementById("changing_img");
var textarea = document.getElementById("entry");


class Chatbox {


    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            voiceButton: document.querySelector('.voice_button')
        }

        this.state = false;
        this.messages = [];
    }



    display() {
        const { openButton, chatBox, sendButton, voiceButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        // sendButton.addEventListener('click', () => this.onSendButton(chatBox))
        voiceButton.addEventListener('click', () => {
            this.GetSpeech(chatBox)
        });

        // recognition.onresult = (e) => {
        //     xx = e.results[0][0].transcript
        //     console.log(xx);
        //     if (xx === "") {
        //         return;
        //     }

        //     let msg1 = { name: "User", message: xx }
        //     this.messages.push(msg1);

        //     fetch('http://127.0.0.1:5000/predict', {
        //         method: 'POST',
        //         body: JSON.stringify({ message: xx }),
        //         mode: 'cors',
        //         headers: {
        //           'Content-Type': 'application/json'
        //         },
        //       })
        //       .then(r => r.json())
        //       .then(r => {
        //         let msg2 = { name: "Sam", message: r.answer };
        //         this.messages.push(msg2);
        //         this.updateChatText(chatbox)
        //         textField.value = ''

        //     }).catch((error) => {
        //         console.error('Error:', error);
        //         this.updateChatText(chatbox)
        //         textField.value = ''
        //       });
        // };

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.GetSpeech(chatBox)
            }
        })
    }


    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    // onVoiceButton(chatbox) 
    // {
    //     recognition.start();
    //     e = recognition.onresult()
    //     console.log(e)
    // }




GetSpeech = (chatBox) => {
    if (textarea.value=="")
    {
        var textField = chatBox.querySelector('input');
        console.log("clicked microphone");
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        let recognition = new SpeechRecognition();
        recognition.onstart = () => {
            new Audio('./static/images/micon.mp3').play()
            console.log("starting listening, speak in microphone");
            c_img.src = "./static/images/newrecording.png"
        }
        recognition.onspeechend = () => {
            console.log("stopped listening");
            c_img.src = "./static/images/newrecord.png"
            recognition.stop();
        }
        recognition.onresult = (result) => {
            xx = result.results[0][0].transcript;
            // console.log("Unchanged audio: "+xx)
            // sentence = xx;
            // const names = ["Aayaan","Akshay","Narasimha","Vijayalakshmi","Somesh","Sridhar","Mahendra","Satish"];
            // var counter=[];

            // var myArray = sentence.split(" ");
            // for(var i =0;i<myArray.length;i++)
            // {
            //     if (myArray[i].charCodeAt()<97)
            //     {
            //         word = myArray[i]
            //     }
            // }
    

            // for(var i=0;i<names.length;i++)
            // {
            //     name = names[i];
            //     var n1 = word.length
            //     var n2 = name.length
            //     counter.push(countPairs(word.toLowerCase(), n1, name.toLowerCase(), n2))
                
            // }
            // console.log(counter)
            // var maxi = Math.max.apply(Math, counter);
            // console.log(maxi/names[counter.indexOf(maxi)].length)
            // if(maxi/names[counter.indexOf(maxi)].length>0.5)
            // {
            //     xxx = sentence.replace(word,names[counter.indexOf(maxi)])
            //     console.log("Corrected audio:"+xxx)
            //     // console.log(names[counter.indexOf(maxi)])
            // }
            // else
            // {
            //     console.log("NONOO")
            // }
            
            let msg1 = { name: "User", message: xx }
            this.messages.push(msg1);
            if (xx == "") {
                return;
            }

            fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: JSON.stringify({ message: xx }),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(r => r.json())
                .then(r => {
                    let msg2 = { name: "Sam", message: r.answer };
                    this.messages.push(msg2);
                    console.log(msg2.message);
                    var utterThis = new SpeechSynthesisUtterance()
                    var voices = window.speechSynthesis.getVoices();
                    utterThis.voice = voices[3];
                    utterThis.text = msg2.message;
                    speechSynthesis.speak(utterThis);
                    this.updateChatText(chatBox)
                    textField.value = ''
                }).catch((error) => {
                    console.error('Error:', error);
                    this.updateChatText(chatBox)
                    textField.value = ''
                });
        }

        recognition.start();
    }
    else{
        console.log(textarea.value + " heyyy")
        // var textField = chatbox.querySelector('input');
        let text1 = textarea.value
    
        if (text1 === "") {
            return;
        }
    
        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
    
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "Sam", message: r.answer };
                this.messages.push(msg2);
                var utterThis = new SpeechSynthesisUtterance()
                var voices = window.speechSynthesis.getVoices();
                utterThis.voice = voices[3];
                utterThis.text = msg2.message;
                speechSynthesis.speak(utterThis);
                this.updateChatText(chatBox)
                textarea.value = ''
                c_img.src = "./static/images/newrecord.png"

    
            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatBox)
                textarea.value = ''
                c_img.src = "./static/images/newrecord.png"
            });
        

    }
}

onSendButton(chatbox) {
    console.log(textarea.value + " heyyy")
    var textField = chatbox.querySelector('input');
    let text1 = textField.value

    if (text1 === "") {
        return;
    }

    let msg1 = { name: "User", message: text1 }
    this.messages.push(msg1);

    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: JSON.stringify({ message: text1 }),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(r => r.json())
        .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            var utterThis = new SpeechSynthesisUtterance()
            var voices = window.speechSynthesis.getVoices();
            utterThis.voice = voices[3];
            utterThis.text = msg2.message;
            speechSynthesis.speak(utterThis);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
        });
}

updateChatText(chatbox) {
    var html = '';
    this.messages.slice().reverse().forEach(function (item, index) {
        if (item.name === "Sam") {
            html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
        }
        else {
            html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
        }
    });

    const chatmessage = chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML = html;
}
}


function countPairs(s1, n1, s2, n2)
{

    // To store the frequencies of
    // characters of string s1 and s2
    let freq1 = new Array(26);
    let freq2 = new Array(26);
    freq1.fill(0);
    freq2.fill(0);

    // To store the count of valid pairs
    let i, count = 0;

    // Update the frequencies of
    // the characters of string s1
    for (i = 0; i < n1; i++)
        freq1[s1[i].charCodeAt() - 'a'.charCodeAt()]++;

    // Update the frequencies of
    // the characters of string s2
    for (i = 0; i < n2; i++)
        freq2[s2[i].charCodeAt() - 'a'.charCodeAt()]++;

    // Find the count of valid pairs
    for (i = 0; i < 26; i++)
        count += (Math.min(freq1[i], freq2[i]));

    return count;
}


textarea.addEventListener('input', hideOnEmpty);
function hideOnEmpty() {
var txt = this.value;
if (txt !== '') {
    c_img.src = "./static/images/submit_button.png";
}
else {
    c_img.src = "./static/images/newrecord.png"
}
}


const chatbox = new Chatbox();
chatbox.display();