
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
  if (
    document.body.scrollTop > 700 ||
    document.documentElement.scrollTop > 700
  ) {
    scrollUpBtn.style.display = "block";
  } else {
    scrollUpBtn.style.display = "none";
  }

};

// // Smooth scroll to top when the button is clicked
function scrollToTop() {
  window.scrollTo(0, 0);
}


function contactMeFun() {
  document.getElementById("mainSectionId").style.display = "none";
  document.getElementById("footerId").style.display = "none";
  document.getElementById("contactForm").style.display = "flex";
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


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}













const code = document.getElementById("maincode").innerText
// console.log(a)

function copyCode(){
    navigator.clipboard.writeText(code);
    let btn = document.getElementById("copybutton");
    const btnValue = 'Copy Again <i class="fa fa-copy" style="font-size:14px"></i>';
    console.log(btnValue)
    btn.innerHTML = "Code Copied";
    delay(1000).then(function () {
      btn.innerHTML = btnValue;
    })
  };