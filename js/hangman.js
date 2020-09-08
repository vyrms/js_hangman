var hangman = {
  // initial values
  lives : 7,
  word : "",
  corrects : 0,
  need_attempt_input : true,
  attempts : 0,
  damage : 0,
  used : [],

  // elements in html
  img_element : null,
  word_element : null,
  keyboard_element : null,
  lives_element : null,
  attempt_element : null,
  bgm : null,

  init : function(){
    // initialize values
    hangman.lives = 7;
    hangman.word = "";
    hangman.corrects = 0;
    hangman.need_attempt_input = true;
    hangman.attempts = 0;
    hangman.damage = 0;
    hangman.used = [];

    // get htm elements
    hangman.img_element = document.getElementById("hang_img");
    hangman.word_element = document.getElementById("word");
    hangman.keyboard_element = document.getElementById("keyboard");
    hangman.lives_element = document.getElementById("lives");
    hangman.attempt_element = document.getElementById("attempt");
    hangman.bgm = new Audio("audio/music/bgm.mp3");


    // generate input space
    // generate input instructions for word
    hangman.word_element.innerHTML += "Please avoid people's names, slang, and informal words!<br>Caution: Pressing buttons will play sounds<br>";
    // generate input space for word
    var word_input = document.createElement("input");
    word_input.type = "text";
    word_input.id = "word_input";
    word_input.placeholder = "Type word here";
    word_input.style = "text-transform:uppercase";
    hangman.word_element.appendChild(word_input);
    // generate submit button
    var submit = document.createElement("input");
    submit.type = "button";
    submit.value = "Enter";
    submit.addEventListener("click", hangman.get_word);
    hangman.word_element.appendChild(submit);

    // print lives
    hangman.lives_element.innerHTML = hangman.lives;

    // set reset button
    var res_button = document.getElementById("reset");
    res_button.disabled = true;
    res_button.addEventListener("click", hangman.reset);
  },

  get_word : function(){
    // get word in word_input
    hangman.word = document.getElementById("word_input").value;

    // test if the input is alphabet only
    if(/^[a-zA-Z ]+$/.test(hangman.word)){
      // make word all uppercase
      hangman.word = hangman.word.toUpperCase().trim().replace(/ {2,}/g, " ");
      // remove input spaces for first user
      hangman.word_element.innerHTML = "";

      // play audio
      var audio = new Audio('audio/se/word_enter.mp3');
      audio.play();

      // play bgm
      hangman.bgm.volume = 0.05;
      hangman.bgm.loop = true;
      hangman.bgm.play();

      // enable reset button
      document.getElementById("reset").disabled = false;

      // generate place for word/xxxxx to appear
      for(i=0; i<hangman.word.length; i++){
        var xxx = document.createElement("span");
        if(hangman.word[i] == " "){
          xxx.innerHTML = "　";
          xxx.id = "letter" + i;
          hangman.word_element.appendChild(xxx);
          hangman.corrects++;
        }else{
          xxx.innerHTML = "_ ";
          xxx.id = "letter" + i;
          hangman.word_element.appendChild(xxx);
        }
      }

      // generate keyboard for second user
      for (var i=65; i<91; i++){
        var key = document.createElement("input");
        key.type = "button";
        key.value = String.fromCharCode(i);
        key.addEventListener("click", hangman.check);
        hangman.keyboard_element.appendChild(key);
      }
    }else{
      // if the input has other characters
      window.alert("Only use alphabets and spaces please!");
    }
  },

  check : function(){
    // disable this letter
    this.disabled = true;

    // check for hits
    var i=0, hits=[];
    while(i >= 0){
      i = hangman.word.indexOf(this.value, i);
      if(i == -1){
        break;
      }else{
        hits.push(i);
        i++;
      }
    }

    // show hit letters & check for win/loss
    if (hits.length > 0){
      // make attempt input
      hangman.make_attempt_input();

      // show letters hit
      for(var hit of hits){
        document.getElementById("letter" + hit).innerHTML = this.value;
      }
      hangman.corrects += hits.length;
      // check for win
      if(hangman.corrects == hangman.word.length){
        // play audio
        var audio = new Audio('audio/se/guess_right.mp3');
        audio.play();

        // disable
        hangman.disable();

        // tell u win
        alert("GUESSER WIN!\nNumber of attempts: " + hangman.attempts);
      }else{
        // play audio
        var audio = new Audio('audio/se/letter_right.mp3');
        audio.play();
      }
    }else{
      // update hangman
      hangman.damage++;
      newimg = "images/hang" + hangman.damage +".png";
      hangman.img_element.src = newimg;

      // subtract live
      hangman.lives--;
      // print lives
      hangman.lives_element.innerHTML = hangman.lives;

      // check for 0 lives
      if(!hangman.lives){
        // play audio
        var audio = new Audio('audio/se/lose.mp3');
        audio.play();
        // disable
        hangman.disable();
        // tell u lose
        alert("GUESSER LOSE!");
      }else{
        // play audio
        var audio = new Audio('audio/se/letter_wrong.mp3');
        audio.play();
      }
    }
  },

  make_attempt_input : function(){
    // check if attempt input is generated
    if(hangman.need_attempt_input){
      hangman.need_attempt_input = false;
      // make attempt input
      var attempt_input = document.createElement("input");
      attempt_input.id = "attempt_field";
      attempt_input.type = "text";
      attempt_input.placeholder = "Attempt here!";
      attempt_input.style = "text-transform:uppercase";
      hangman.attempt_element.appendChild(attempt_input);
      //make attempt submission button
      var attempt_submit = document.createElement("input");
      attempt_submit.type = "button";
      attempt_submit.value = "Enter";
      attempt_submit.addEventListener("click", hangman.attempt);
      hangman.attempt_element.appendChild(attempt_submit);
    }
  },

  attempt : function(){
    //count attempt
    hangman.attempts++;

    // get input value
    var attempt_word = document.getElementById("attempt_field");
    // if word is right
    if(attempt_word.value.toUpperCase() == hangman.word){
      // play audio
      var audio = new Audio('audio/se/guess_right.mp3');
      audio.play();
      // disable
      hangman.disable();

      // tell u win
      alert("GUESSER WIN!\nNumber of attempts: " + hangman.attempts);
    }else{
      // play audio
      var audio = new Audio('audio/se/guess_wrong.mp3');
      audio.play();

      alert("WRONG!");
    }

  },

  disable : function(){
    // disable all letter input buttons
    var input_buttons = document.querySelectorAll("#keyboard input");
    for(var button of input_buttons){
      button.disabled = true;
    }
    // disable attempt input if attempt input is already made
    if(!hangman.need_attempt_input){
      var attempt_inputs = document.querySelectorAll("#attempt input");
      for(var thing of attempt_inputs){
        thing.disabled = true;
      }
    }
  },

  reset : function(){
    // play audio
    var audio = new Audio('audio/se/reset.mp3');
    audio.play();

    // stop bgm
    hangman.bgm.pause();

    // remove guesser UIs
    hangman.word_element.innerHTML = "";
    hangman.attempt_element.innerHTML = "";
    hangman.keyboard_element.innerHTML = "";

    // put first image
    hangman.img_element.src = "images/hang0.png";

    // re-initialize
    hangman.init();
  }
};


window.addEventListener("load", hangman.init);
