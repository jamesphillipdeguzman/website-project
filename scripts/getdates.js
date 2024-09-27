document.getElementById("lastModified").innerHTML = document.lastModified;
// use the date object
const today = new Date();
const year = document.querySelector("#currentyear");
year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;



