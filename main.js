let tempLocal = localStorage.getItem("exercises") || `|§Push ups§10§0§Reps|§Sit ups§15§0§Reps|§Plank§20§0§Seconds`;
let timeLoaded = new Date();

function addExercise(exercises) {
    let errorTest;
    try { errorTest = exercises.split("§"); }
    catch(err) { return; }

    let row = document.createElement("tr");
    let exercise = exercises.split("§");

    row.innerHTML = `
        <td class="move"><div></div><div></div></td>
        <td>${exercise[1]}</td>
        <td>${exercise[2]} ${exercise[4]}</td>
    `;

    let inputParent = document.createElement("td");
    let input = document.createElement("input");
    input.value = exercise[3];
    input.addEventListener("keyup", () => percentChange(input))
    inputParent.appendChild(input);
    row.appendChild(inputParent);


    let actions = document.createElement("td");
    if (exercise[4] == "Seconds") {
        actions.innerHTML = `
        <button class="button">Start Time</button>
        <button class="button" style="display: none">Pause Time</button>
        <button class="button" style="background: #ff0033;">Remove</button>
        `;

        let inter;
        actions.querySelectorAll("button").forEach((e) => {
            if (e.innerHTML.includes("Start")) {
                e.addEventListener("click", () => {
                    inter = setInterval(() => {
                        e.parentElement.parentElement.querySelector("input").value
                            = e.parentElement.parentElement.querySelector("input").value - 0 + 1;

                        percentChange(e);
                    }, 1000);

                    e.nextElementSibling.style.display = "block";
                    e.style.display = "none";
                });
            }
            else if (e.innerHTML.includes("Pause")) {
                e.addEventListener("click", () => {
                    e.previousElementSibling.style.display = "block";
                    e.style.display = "none";

                    clearInterval(inter);
                });
            }
            else e.addEventListener("click", () => e.parentElement.parentElement.remove());
        });
    }
    else {
        actions.innerHTML = `
        <button class="button">Add 5</button>
        <button class="button">Add 10</button>
        <button class="button" style="background: #ff0033;">Remove</button>
        `;
        actions.querySelectorAll("button").forEach((e) => {
            if (e.innerHTML.includes("Add")) {
                e.addEventListener("click", () => {
                    e.parentElement.parentElement.querySelector("input").value 
                    = e.parentElement.parentElement.querySelector("input").value - 0 + (e.innerHTML.split(" ")[1] - 0);
                    percentChange(e);
                });
            }
            else e.addEventListener("click", () => e.parentElement.parentElement.remove());
        });
    }

    row.appendChild(actions);
    document.querySelector("tbody").appendChild(row);
    document.querySelectorAll("tr:has(td)").forEach((e) => { percentChange(e) });
}

function initExercises() {
    let exercises = tempLocal.split("|");
    if (exercises.length < 2) return;
    
    for (let i = 1; i < tempLocal.length; i++)
        addExercise(exercises[i]);
};

function saveExercises() {
    let str = "";
    document.querySelectorAll("tr:has(td)").forEach((e) => {
        str += '|§' + e.firstElementChild.nextElementSibling.innerHTML + '§';
        str += e.firstElementChild.nextElementSibling.nextElementSibling.innerHTML.split(" ")[0] + '§';
        str += e.querySelector("input").value + '§';
        str += e.firstElementChild.nextElementSibling.nextElementSibling.innerHTML.split(" ")[1];
    });
    localStorage.setItem("exercises", str);
}

document.querySelector(".add_exercise button").addEventListener("click", (e) => {
    let parent = e.target.parentElement;
    let rowString = '|§'
        + parent.querySelector(".exercise").value + '§'
        + parent.querySelector(".goal").value +'§0§'
        + parent.querySelector(".type").value;
    addExercise(rowString);
})

document.querySelectorAll(".typeDropDown li").forEach((e) => {
    e.addEventListener("click", () => e.parentElement.previousElementSibling.value = e.innerHTML );
})

function percentChange(item) {
    let parent = item.nodeName == "TR" ? item : item.parentElement.parentElement;
    let percent = (parent.querySelector("input").value / parent.firstElementChild.nextElementSibling.nextElementSibling.innerHTML.split(" ")[0]) * 100;

    parent.style.setProperty('--percent', `${percent}%`);
    if (percent >= 100 && percent < 105 && new Date() - timeLoaded > 1000 && item.nodeName != "TR") setTimeout(celebrate, 200)
};

let myCanvas = document.createElement('canvas');
document.querySelector('#celebrate').appendChild(myCanvas);
function celebrate() {
    confetti({
        particleCount: 250,
        startVelocity: 60,
        spread: 360,
    });
};

initExercises();
setInterval(saveExercises, 1000);

document.querySelectorAll("td.move").forEach((e) => {
    e.firstElementChild.addEventListener("click", () => {
        let table = e.parentElement.parentElement;
        let current = e.parentElement;
        let next = e.parentElement.previousElementSibling;

        if (next.firstElementChild.nodeName == "TH") return;

        let wasOdd = false;
        document.querySelectorAll("table tr:nth-child(odd)").forEach((e) => {
            if (e == current) {
                next.setAttribute("style", "transform: translateY(100%); transition: 200ms; background: #0c1822;");
                current.setAttribute("style", "transform: translateY(-100%); transition: 200ms; background: transparent");
                wasOdd = true;
            }
        })
        if (!wasOdd) {
            next.setAttribute("style", "transform: translateY(100%); transition: 200ms; background: transparent;");
            current.setAttribute("style", "transform: translateY(-100%); transition: 200ms; background: #0c1822;");
        }

        setTimeout(() => {
            next.setAttribute("style", "");
            current.setAttribute("style", "");
            table.insertBefore(current, next);

            percentChange(current);
            percentChange(next);
        }, 200);
    });
    e.lastElementChild.addEventListener("click", () => {
        let table = e.parentElement.parentElement;
        let current = e.parentElement;
        let next = e.parentElement.nextElementSibling;

        if (next == null) return;

        let wasOdd = false;
        document.querySelectorAll("table tr:nth-child(odd)").forEach((e) => {
            if (e == current) {
                next.setAttribute("style", "transform: translateY(-100%); transition: 200ms; background: #0c1822;");
                current.setAttribute("style", "transform: translateY(100%); transition: 200ms; background: transparent");
                wasOdd = true;
            }
        })
        if (!wasOdd) {
            next.setAttribute("style", "transform: translateY(-100%); transition: 200ms; background: transparent;");
            current.setAttribute("style", "transform: translateY(100%); transition: 200ms; background: #0c1822;");
        }

        setTimeout(() => {
            next.setAttribute("style", "");
            current.setAttribute("style", "");
            table.insertBefore(next, current);

            percentChange(current);
            percentChange(next);
        }, 200);
    })
})