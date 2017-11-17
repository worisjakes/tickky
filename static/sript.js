function addClass(){
var tac = document.getElementById("tac");
tac.classList.remove("tc");
tac.classList.add("tac");
}
function addClasstoe(){
var tac = document.getElementById("toe");
tac.classList.remove("tc");
tac.classList.add("toe");
}
setInterval(addClass, 2500);
setInterval(addClasstoe, 4000);
var demo = document.getElementById("demo");
demo.addEventListener("click", function(){
    interval = setInterval(function(){
      addX();
    }, 3000);
});
counter =0;
 function addX(){
  var cells = document.getElementsByClassName("cell");
  var span = document.createElement("span");
  var x = document.createTextNode("X");
  var o = document.createTextNode("O");
  var elem = document.querySelectorAll("div.cell span");
  var btn = document.getElementById("demo");
  btn.innerHTML ="Re-start Demo";
  
  if(counter++ < 10){
    switch (counter){
      case 1:
        span.appendChild(x);
        cells[0].appendChild(span);
        break;
      case 2:
        span.appendChild(o);
        cells[4].appendChild(span);
        break;
      case 3:
        span.appendChild(x);
        cells[6].appendChild(span);
        break;
      case 4:
        span.appendChild(o);
        cells[3].appendChild(span);
        break;
      case 5:
        span.appendChild(x);
        cells[5].appendChild(span);
        break;
      case 6:
        span.appendChild(o);
        cells[1].appendChild(span);
        break;
      case 7:
        span.appendChild(x);
        cells[7].appendChild(span);
        break;
      case 8:
        span.appendChild(o);
        cells[8].appendChild(span);
        break;
      case 9:
        span.appendChild(x);
        cells[2].appendChild(span);
        break;
  }
}
  if(counter == 10){
    if(btn.innerHTML === "Re-start Demo"){
      for(var i = 0; i<elem.length; i++){
        elem[i].innerHTML = "";
    }
    clearInterval(interval);
    counter = 0;
  }
  }
}
function Show(){
  var btn = document.getElementById("bttn");
  btn.style.color = "red";
  var form = document.getElementById("form");
  form.style.display = "block";

}