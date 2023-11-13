const addExerciseBtn = document.querySelector("button:nth-child(3)");
addExerciseBtn.addEventListener("click", () => addExercise(
    document.querySelector("#exercise").value, 
    document.querySelector("#goal").value, 
    0, false)
);

getExerciseFromLocalStorage();

function addExercise(exerciseValue, goalValue, amountValue, isfromls) {
    if (!isfromls) {
        if (checkIfExerciseIsAdded(exerciseValue)) return;
        if (checkInputs(exerciseValue, goalValue)) return;
        addExerciseToLocalStorage(exerciseValue, goalValue, amountValue);
        clearInputValues();
    }

    const table = document.querySelector(".exercise_table");
    const row = table.insertRow(-1);

    const exercise = row.insertCell(0);
    exercise.textContent = exerciseValue;

    const goal = row.insertCell(1);
    goal.textContent = goalValue;

    const amount = row.insertCell(2);
    const input = document.createElement("input");
    input.type = "number";
    input.onchange = checkGoal;
    input.placeholder = 0;
    input.value = amountValue;
    amount.append(input);
    
    const Action = row.insertCell(3);
    const button1 = document.createElement("button");
    button1.classList.add("button");
    button1.classList.add("complete_button");
    button1.onclick = complete;
    button1.textContent = "Complete";
    Action.append(button1);

    const button2 = document.createElement("button");
    button2.classList.add("button");
    button2.classList.add("add_button");
    button2.onclick = addExerciseValue;
    button2.innerHTML = "Add <span>5</span>";
    Action.append(button2);

    const button3 = document.createElement("button");
    button3.classList.add("button");
    button3.classList.add("add_button");
    button3.onclick = addExerciseValue;
    button3.innerHTML = "Add <span>10</span>";
    Action.append(button3);

    const button4 = document.createElement("button");
    button4.classList.add("button");
    button4.style.background = 'red';
    button4.style.marginLeft = '1%';
    button4.onclick = removeExercise;
    button4.textContent = "Remove";
    Action.append(button4);
}

function complete() {
    let index = this.parentNode.parentNode;
    let indexNum = index.rowIndex;
    if (index.querySelector('input').value-0 >= index.querySelector('td:nth-child(2)').innerHTML-0) {
        index.classList.add('completed-ani');
        celebrate();
        setTimeout(() => {
            document.querySelector(".exercise_table").deleteRow(indexNum);
            localStorage.removeItem('exercise' + (indexNum).toString());
            addExerciseToLocalStorage(null, null, null);
        }, 2000);
    }
    else alert('Your Amount of exercise does not match you set goal')
} 

function addExerciseValue() {
    input = this.parentNode.parentNode.querySelector('input');
    input.value = input.value-0 + parseInt(this.querySelector('span').innerHTML);
    addExerciseToLocalStorage(null, null, null);
    let goal = this.parentNode.parentNode.querySelector('td:nth-child(2)').innerHTML - 0;
    if (this.parentNode.parentNode.querySelector('input').value - 0 >= goal) celebrate()
}

function removeExercise() {
    var index = this.parentNode.parentNode.rowIndex;
    document.querySelector(".exercise_table").deleteRow(index);
    localStorage.removeItem('exercise' + index);
    addExerciseToLocalStorage(null, null, null);
}

function clearInputValues() {
    document.querySelector("#exercise").value = "";
    document.querySelector("#goal").value = "";
} function checkInputs(exercise, goal) {
    if (exercise === "" || goal === "") {
        console.error(`Error: Values are empty!`);
        return true;
    }
} function checkIfExerciseIsAdded(exercise) {
    const rows = document.querySelectorAll(".exercise_table tr");
    for (let i = 1; i < rows.length; i++) {
        const td = rows[i].querySelector("td").textContent;
        if (td === exercise) {
            alert.error(`Error: "${exercise}" is already added!`);
            return true;
        };
    }
}

function addExerciseToLocalStorage(exercise, goal, amount) {
    const rows = document.querySelectorAll(".exercise_table tr");
    if (exercise === null) {
        localStorage.clear();
        for (let i = 1; i <= rows.length-1; i++) {
            localStorage.setItem('exercise' + (i).toString(),
                JSON.stringify([
                    rows[i].childNodes[0].innerHTML,
                    rows[i].childNodes[1].innerHTML-0,
                    rows[i].querySelector('input').value-0,
                ]) 
            );
        }
    }
    else 
        localStorage.setItem(
            'exercise' + rows.length,
            JSON.stringify([exercise, goal, amount])
        );
}

function getExerciseFromLocalStorage() {
    for (let i = 1; i <= localStorage.length; i++) {
        if (localStorage.getItem('exercise' + i) === null)
            localStorage.removeItem('exercise' + i);
        else {
            let exerciseLs = JSON.parse(localStorage.getItem('exercise'+i));
            addExercise(exerciseLs[0], exerciseLs[1], exerciseLs[2], true)
        }
    }
}

function checkGoal() {
    addExerciseToLocalStorage(null, null, null)
    let goal = this.parentNode.parentNode.querySelector('td:nth-child(2)').innerHTML - 0;
    if (this.value >= goal) celebrate();
}

document.querySelector('#goal').addEventListener("keydown", (e) => { 
    if (e.key !== "Enter") return;
    addExercise(document.querySelector("#exercise").value, document.querySelector("#goal").value, 0, false);
})

let myCanvas = document.createElement('canvas');
document.querySelector('#celebrate').appendChild(myCanvas);
function celebrate() {
    for (let i = 0; i <= innerWidth / 100; i++) {
        confetti({
            particleCount: 50,
            startVelocity: 30,
            spread: 360,
            origin: {
                x: Math.random(),
                y: Math.random() - 0.2
            }
        });
    }
}

if (document.querySelectorAll(".exercise_table tr").length <= 1 ) {
    addExercise('Push-Ups', 20, 0, false)
    addExercise('Sit-Ups', 20, 0, false)
    addExercise('Squats', 40, 0, false)
}