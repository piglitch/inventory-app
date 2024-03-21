document.addEventListener("DOMContentLoaded", function() {
  const dropdown1 = document.getElementById("d1");
  const dropdown2 = document.getElementById("d2");
  const dropdown3 = document.getElementById("d3");
  const dropdown4 = document.getElementById("d4");

  if (dropdown1) {
    dropdown1.addEventListener("click", (e) => {
      document.getElementById("dc1").classList.toggle('visible');
      console.log(e, 1);
    });
  }

  if (dropdown2) {
    dropdown2.addEventListener("click", (e) => {
      document.getElementById("dc2").classList.toggle('visible');
      console.log(e, 2);
    });
  }

  if (dropdown3) {
    dropdown3.addEventListener("click", (e) => {
      document.getElementById("dc3").classList.toggle('visible');
      console.log(e, 3);
    });
  }

  if (dropdown4) {
    dropdown4.addEventListener("click", (e) => {
      document.getElementById("dc4").classList.toggle('visible');
      console.log(e, 4);
    });
  }
});
