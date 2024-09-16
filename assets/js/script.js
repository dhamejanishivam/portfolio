// Typing Animation:
var typed = new Typed("#element", {
  strings: [
    "Python Developer",
    "Web Developer",
    "Data Structures Specialist",
    "C/C++ Enthusiast",
    "Communication Skills Enthusiast",
    "SQL Expert",
    "Linux User",
    "GitHub Contributor"
  ],
  typeSpeed: 30,
  backSpeed: 15,
  loop: true,
});
const spotlight = document.getElementById("spotlight");






// Spotlight:
document.addEventListener("mousemove", function (e) {
  // Set spotlight position to follow the cursor
  spotlight.style.left = `${e.pageX}px`;
  spotlight.style.top = `${e.pageY}px`;
});





// Show the button when the user scrolls down 700px from the top
window.onscroll = function () {
  let scrollUpBtn = document.getElementById("scrollUpBtn");
  let aboutBox = document.getElementById("aboutBox");

  // Handle scroll up button visibility
  if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
    scrollUpBtn.style.display = "block";
  } else {
    scrollUpBtn.style.display = "none";
  }

  // Handle the About Me paragraph typing animation
  if ((document.body.scrollTop > 900 || document.documentElement.scrollTop > 900) && !typerExecuted) {
    aboutBox.classList.add('aboutBoxAni');
    typer();
    typerExecuted = true; // Set the flag to true so typer won't run again
  }
};

// // Smooth scroll to top when the button is clicked
function scrollToTop() {
    window.scrollTo(0,0);       
}








function downloadResume(){
    window.open('assets/other/myresume.pdf','_blank');
};


function visitGithub() {
    window.open('https://github.com/dhamejanishivam', '_blank');
};






// This below is code typing the About Me Paragaraph

let typerExecuted = false;


function typer(){
  var i = 0;
  var txt = " In my free time, I immerse myself in a variety of activities that keep both my mind and body active. I'm an avid reader and have devoured a wide range of novels, always eager to discover new stories and perspectives. When I'm not reading, you’ll likely find me exploring new technologies, watching captivating films, or honing my skills in swimming, cricket, or basketball.";
  var speed = 10;
  function typeWriter(){
    // alert(1);
    if(i < txt.length){
      document.getElementById("aboutMePara").innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter,speed);
    }
  };
  typeWriter();
  typerExecuted = true;
};



