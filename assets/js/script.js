
const spotlight = document.getElementById("spotlight");

// Spotlight:
document.addEventListener("mousemove", function (e) {
  // Set spotlight position to follow the cursor
  spotlight.style.left = `${e.pageX}px`;
  spotlight.style.top = `${e.pageY}px`;
});




function scrollToFun(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.error(`Element with ID '${id}' not found.`);
  }
}


var maxCharHighlighted = 0;

// Show the button when the user scrolls down 700px from the top
window.onscroll = function () {
  let scrollUpBtn = document.getElementById("scrollUpBtn");
  let aboutBox = document.getElementById("aboutBox");

  // Handle scroll up button visibility
  if (
    document.body.scrollTop > 700 ||
    document.documentElement.scrollTop > 700
  ) {
    scrollUpBtn.style.display = "block";
  } else {
    scrollUpBtn.style.display = "none";
  }



  // Project Section:
  const projectSections = document.querySelectorAll(".projectSection .projectBox");
  const minWidth = 60; // Minimum width percentage
  const maxWidth = 100; // Maximum width percentage
  
  projectSections.forEach(element => {
    const box = element.getBoundingClientRect();
    if (box.top < window.innerHeight && box.top > window.innerHeight / 2) {
      const diff = window.innerHeight - box.top; // Distance from bottom
      const factor = 0.1; // Adjust this to control how fast width increases

      // Calculate the percentage increase
      let percentIncrease = Math.min(diff * factor, maxWidth - minWidth);

      // Apply the width, ensuring it stays within minWidth and maxWidth
      element.style.width = `${minWidth + percentIncrease}%`;

      console.log(`Element width set to: ${minWidth + percentIncrease}%`);



    }
  })






  var aboutMePara = document.getElementById("aboutMePara");
  var rect = aboutMePara.getBoundingClientRect();
  var windowHeight = window.innerHeight;


  // if(rect.top < window.innerHeight && rect.bottom >= 0){
  if(rect.top < window.innerHeight || rect.bottom >= 0 || 1 == 1){
    
    var visibleHeight = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);

    var fontSize = parseFloat(getComputedStyle(aboutMePara).fontSize);
    var lineHeight = fontSize * 1.4;
    var visbleLines = (visibleHeight/ lineHeight);

    var maxLines = (((rect.bottom-rect.top)/lineHeight))
    var totalCharacters = 373;
    var charactersINOneLine = totalCharacters/maxLines;

    var charsToHighlight = charactersINOneLine*(visbleLines-2);

    if(window.screen.width<800 && rect.top<0){
      charsToHighlight = totalCharacters
    }
    if(window.screen.width<800 && rect.top>window.innerHeight){
      charsToHighlight = 0
    }

    if(visbleLines==maxLines){
      charsToHighlight = charactersINOneLine*visbleLines
    }

    var textHighlight = (aboutMePara.innerText).substring(0, charsToHighlight);
    var remainingText = aboutMePara.innerText.substring(charsToHighlight);

    var updatedText = `<span class='highlitedText'>${textHighlight}</span>${remainingText}`
    aboutMePara.innerHTML = updatedText;
  }
};

// // Smooth scroll to top when the button is clicked
function scrollToTop() {
  window.scrollTo(0, 0);
}

function downloadResume() {
  const link = document.createElement("a"); // Create a new anchor element
  link.href = "assets/other/myresume.pdf"; // File URL
  link.download = "ShivamDhamejani_Resume.pdf"; // Specify the download filename
  document.body.appendChild(link); // Append the link to the document
  link.click(); // Trigger the download
  document.body.removeChild(link); // Remove the link after download
  window.location.href = 'assets/other/myresume.pdf';
}

function visitGithub() {
  window.open("https://github.com/dhamejanishivam", "_blank");
}

function contactMeFun() {

  

}

function unhideBody(){
  document.getElementById("contactForm").style.display = "none";
  document.getElementById("mainSectionId").style.display = "block";
  document.getElementById("footerId").style.display = "block";
}




function typingMasterAnimation(txt,speed,elementid){
  var i = 0;
  function typeRecursion(){
      if(i<txt.length){
        document.getElementById(elementid).innerHTML+=txt.charAt(i);
        i++;
        setTimeout(typeRecursion,speed);
      }
  }
  typeRecursion();

}


function noner() {
  
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


function copyMailId(arg1){
  mailId = "dhamejanishivam@gmail.com"
  idField = "emailIdField2"
  if(arg1==1){
    mailId = "shivam9644971120@gmail.com"
    idField = "emailIdField1"
  }
  navigator.clipboard.writeText(mailId);
  document.getElementById(idField).innerHTML = "";
  var txt = "Email Copied Successfully";
  var speed = 30;
  typingMasterAnimation(txt,speed,idField);
  delay(1500).then(() => document.getElementById(idField).innerHTML = "")
  delay(1700).then(() => typingMasterAnimation(mailId,speed,idField))
  
}

// This below is code typing the About Me Paragaraph

let typerExecuted = false;

function typer() {
  var i = 0;
  var txt =
    " In my free time, I immerse myself in a variety of activities that keep both my mind and body active. I'm an avid reader and have devoured a wide range of novels, always eager to discover new stories and perspectives. When I'm not reading, you’ll likely find me exploring new technologies, watching captivating films, or honing my skills in swimming, cricket, or basketball.";
  var speed = 10;
  function typeWriter() {
    // alert(1);
    if (i < txt.length) {
      document.getElementById("aboutMePara").innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();
  typerExecuted = true;
}













// Typing Animation:
var typed = new Typed("#element", {
  strings: [
    "Python Developer",
    "Web Developer",
    "DSA Specialist",
    "C/C++ Enthusiast",
    "SQL Expert",
    "Linux User",
    "GitHub Contributor",
  ],
  typeSpeed: 30,
  backSpeed: 15,
  loop: true,
});
