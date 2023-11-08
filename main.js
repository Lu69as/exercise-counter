const addExerciseBtn = document.querySelector("button:nth-child(3)");
addExerciseBtn.addEventListener("click", () => addExercise(
    document.querySelector("#exercise").value, 
    document.querySelector("#goal").value, 
    0, false)
);
const saveExerciseBtn = document.querySelector("button:nth-child(4)");
saveExerciseBtn.addEventListener("click", () => addExerciseToLocalStorage(
    null, null, null)
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
    input.onkeyup = checkGoal
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
    button2.onclick = addExerciseValue5;
    button2.textContent = "Add 5";
    Action.append(button2);

    const button3 = document.createElement("button");
    button3.classList.add("button");
    button3.classList.add("add_button");
    button3.onclick = addExerciseValue10;
    button3.textContent = "Add 10";
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
    var index = this.parentNode.parentNode.rowIndex + 1;
    if (document.querySelector('tr:nth-child('+index+') td:nth-child(3) input').value-0 >= 
        document.querySelector('tr:nth-child('+index+') td:nth-child(2)').innerHTML-0) {
        document.querySelector('tr:nth-child(2)').classList.add('completed-ani');
        checkGoal()
        setTimeout(() => {
            addExerciseToLocalStorage(null, null, null)
            document.querySelector(".exercise_table").deleteRow(index-1);
            localStorage.removeItem('exercice' + (index-1).toString());
            localStorage.removeItem('goal' + (index-1).toString());
            localStorage.removeItem('amount' + (index-1).toString());
        }, 2000);
    }
    else {
        alert('Your Amount of exercice does not match you set goal')
    }
} 

function addExerciseValue5() {
    var index = this.parentNode.parentNode.rowIndex + 1;
    document.querySelector('tr:nth-child('+index+') td:nth-child(3) input').value = 
    document.querySelector('tr:nth-child('+index+') td:nth-child(3) input').value - 0 + 5;
    addExerciseToLocalStorage(null, null, null);
    let goal = this.parentNode.parentNode.querySelector('td:nth-child(2)').innerHTML - 0;
    if (this.parentNode.parentNode.querySelector('input').value - 0 >= goal) celebrate()
} function addExerciseValue10() {
    var index = this.parentNode.parentNode.rowIndex + 1;
    document.querySelector('tr:nth-child('+index+') td:nth-child(3) input').value = 
    document.querySelector('tr:nth-child('+index+') td:nth-child(3) input').value - 0 + 10;
    addExerciseToLocalStorage(null, null, null);
    let goal = this.parentNode.parentNode.querySelector('td:nth-child(2)').innerHTML - 0;
    if (this.parentNode.parentNode.querySelector('input').value - 0 >= goal) celebrate()
}

function removeExercise() {
    addExerciseToLocalStorage(null, null, null)
    var index = this.parentNode.parentNode.rowIndex;
    document.querySelector(".exercise_table").deleteRow(index);
    localStorage.removeItem('exercice' + index);
    localStorage.removeItem('goal' + index);
    localStorage.removeItem('amount' + index);
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
            console.error(`Error: "${exercise}" is already added!`);
            return true;
        };
    }
}

function addExerciseToLocalStorage(exercise, goal, amount) {
    const rows = document.querySelectorAll(".exercise_table tr");
    if (exercise === null) {
        for (let i = 1; i <= 99 + 1; i++) {
            localStorage.removeItem('exercice' + (i).toString());
            localStorage.removeItem('goal' + (i).toString());
            localStorage.removeItem('amount' + (i).toString());
        }
        for (let i = 2; i <= rows.length; i++) {
            localStorage.setItem('exercice' + (i-1).toString(), document.querySelector('tr:nth-child('+i+') td:nth-child(1)').innerHTML);
            localStorage.setItem('goal' + (i-1).toString(), document.querySelector('tr:nth-child('+i+') td:nth-child(2)').innerHTML);
            localStorage.setItem('amount' + (i-1).toString(), document.querySelector('tr:nth-child('+i+') td:nth-child(3) input').value);
        }
    }
    else {
        localStorage.setItem('exercice' + rows.length, exercise);
        localStorage.setItem('goal' + rows.length, goal);
        localStorage.setItem('amount' + rows.length, amount);
    }
}

function getExerciseFromLocalStorage() {
    let localLength = localStorage.length;
    for (let i = 1; i <= localLength; i++) {
        if (localStorage.getItem('exercice' + i) === null) {
            localStorage.removeItem('exercice' + i);
            localStorage.removeItem('goal' + i);
            localStorage.removeItem('amount' + i);
        }
        else {
            addExercise(
                localStorage.getItem('exercice' + i),
                localStorage.getItem('goal' + i),
                localStorage.getItem('amount' + i),
                true
            )
        }
    }
}

function checkGoal() {
    let goal = this.parentNode.parentNode.querySelector('td:nth-child(2)').innerHTML - 0;
    if (this.value >= goal) celebrate();
}

// Check for keyboard input and add exercise if enter button is pressed
document.querySelector('#goal').addEventListener("keydown", (e) => { 
    if (e.key !== "Enter") return;
    addExercise(document.querySelector("#exercise").value, document.querySelector("#goal").value, 0, false);
})

var myCanvas = document.createElement('canvas');
document.querySelector('#celebrate').appendChild(myCanvas);
function celebrate() {
    var myConfetti = confetti.create(myCanvas, {
        resize: true,
        useWorker: true
    });
    myConfetti({
        particleCount: 500,
        spread: 5000
    });
}

if (document.querySelectorAll(".exercise_table tr").length <= 1 ) {
    addExercise('Push-Ups', 20, 0, false)
    addExercise('Sit-Ups', 20, 0, false)
    addExercise('Squats', 40, 0, false)
}