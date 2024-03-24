document.addEventListener("DOMContentLoaded", function() {
  const dropdown1 = document.getElementById("d1");
  const dropdown2 = document.getElementById("d2");
  const dropdown3 = document.getElementById("d3");
  const dropdown4 = document.getElementById("d4");

  if (dropdown1) {
    dropdown1.addEventListener("click", (e) => {
      document.getElementById("dc1").classList.toggle('visible');
      console.log(e, 1);
      e.stopPropagation(); // Prevent event bubbling to document.body
    });
  }

  if (dropdown2) {
    dropdown2.addEventListener("click", (e) => {
      document.getElementById("dc2").classList.toggle('visible');
      console.log(e, 2);
      e.stopPropagation(); // Prevent event bubbling to document.body
    });
  }

  if (dropdown3) {
    dropdown3.addEventListener("click", (e) => {
      document.getElementById("dc3").classList.toggle('visible');
      console.log(e, 3);
      e.stopPropagation(); // Prevent event bubbling to document.body
    });
  }

  if (dropdown4) {
    dropdown4.addEventListener("click", (e) => {
      document.getElementById("dc4").classList.toggle('visible');
      console.log(e, 4);
      e.stopPropagation(); // Prevent event bubbling to document.body
    });
  }

  document.body.addEventListener("click", (e) => {
    if (e.target !== dropdown1 && e.target !== dropdown2 && e.target !== dropdown3 && e.target !== dropdown4) {
      document.getElementById("dc1").classList.remove('visible');
      document.getElementById("dc2").classList.remove('visible');
      document.getElementById("dc3").classList.remove('visible');
      document.getElementById("dc4").classList.remove('visible');
      console.log(e);
    }
  });
  const animation = document.querySelector(".animation");
  const posX = event.clientX - animation.offsetWidth / 2;
  const posY = event.clientY - animation.offsetHeight / 2;

  animation.style.left = posX + "px";
  animation.style.top = posY + "px";

  animation.style.animationName = "pulse"; // Start animation
  setTimeout(() => {
    animation.style.animationName = "none"; // Stop animation after duration
    animation.style.opacity = 0;  
  }, 500);
  document.addEventListener("click", function(event) {
    const animation = document.querySelector(".animation");
    const posX = event.clientX - animation.offsetWidth / 2;
    const posY = event.clientY - animation.offsetHeight / 2;

    animation.style.left = posX + "px";
    animation.style.top = posY + "px";

    animation.style.animationName = "pulse"; // Start animation
    setTimeout(() => {
        animation.style.animationName = "none"; // Stop animation after duration
        animation.style.opacity = 0;  
    }, 500);
  });
});
