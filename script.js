//QUERY SELECTORS
const habits = document.querySelectorAll('.habit-btn');
const themeBtn = document.querySelector('#theme');
const modalContainer = document.querySelector('.modal-container');
const habitContainer = document.querySelector('.habit-container');
const createHabitBtn = document.querySelector('.new-habit__add');
const newHabitTitle = document.querySelector('#title');
const icons = document.querySelectorAll('.icon');
const addBtn = document.querySelector('#add');
const cancelBtn = document.querySelector('#cancel');

// FUNCTIONS

const storage = {
    saveTheme(value) {
        localStorage.setItem('habitsapp.theme', `${value}`);
    },
    checkTheme(){
        return localStorage.getItem('habitsapp.theme');
    },
    saveHabit(object) {
        const currentHabits = storage.getHabits();
        if (currentHabits === null || currentHabits === '') {
            localStorage.setItem('habitsapp.habits', JSON.stringify(object));
        } else {
            currentHabits.push(object);
            localStorage.setItem('habitsapp.habits', JSON.stringify(currentHabits));
        }
    },
    getHabits() {
        let currentHabits;
        if(localStorage.getItem('habitsapp.habits') === null) {
            currentHabits = [];
        } else {
            currentHabits = JSON.parse(localStorage.getItem('habitsapp.habits'));
        }
        return currentHabits;
    },
    habitStatus(id){
        const currentHabits = storage.getHabits();
        currentHabits.forEach(habit => {
            if(habit.id !== Number(id)) return;
            habits.completed === true ? habit.completed = false : habit.completed = true;
        })
        localStorage.setItem('habitsapp.habits', JSON.stringify(currentHabits));
    }
}   

const ui = {
    // This function toggles 'dark' on  themeBtn and root variables
    theme(){
        themeBtn.classList.toggle('dark');
        const root = document.querySelector(':root');
        root.classList.toggle('dark');

        // Then, this statement checks if it contains dark and saves 'dark' to local storage || if it contains 'light' saves 'light' to local storage
        themeBtn.classList.contains('dark') ? storage.saveTheme('dark') : storage.saveTheme('light'); 
    },
    openModal() {
        modalContainer.classList.add('active');
        modalContainer.setAttribute('aria-hidden', 'false');
        newHabitTitle.focus(); //this .focus() automagically adds the cursor to the input field when modal is opened!!!
    },
    closeModal() {
        modalContainer.classList.remove('active');
        modalContainer.setAttribute('aria-hidden', 'true');
        newHabitTitle.value = '';
        ui.removeSelectedIcon();
    },
    removeSelectedIcon() {
        icons.forEach(icon => {
            icon.classList.remove('selected');
        })
    },
    addNewHabit(title, icon, id, completed){
        const habitDiv = document.createElement('div');
        habitDiv.classList.add('habit');
        habitDiv.innerHTML= `
            <button class="habit-btn ${completed === true ? 'completed' : ''}" data-id="${id}" data-title="${title}">
                <i height="48" width="48">${icon}</i>
            </button>
            `;
        habitContainer.appendChild(habitDiv);
    },
    refreshHabits(){
        const uiHabits = document.querySelectorAll('.habit');
        uiHabits.forEach(habit => habit.remove());
        const currentHabits = storage.getHabits();

        currentHabits.forEach(habit => {
            ui.addNewHabit(habit.title, habit.icon, habit.id, habit.completed);
        });
        console.table(currentHabits);
    }
}

//EVENT LISTENERS

//EVENT: window load
window.addEventListener('DOMContentLoaded', () => {
    //load theme
    const theme = storage.checkTheme();
    if (theme === 'dark') ui.theme();

    //update UI
    ui.refreshHabits();
})


//EVENT : theme button
themeBtn.addEventListener('click', ui.theme);

//EVENT : add habit btn
createHabitBtn.addEventListener('click', ui.openModal);


//EVENT : close modal w/ button click
cancelBtn.addEventListener('click', ui.closeModal)

//EVENT : close modal w/ esc key
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        ui.closeModal();
    }
})

//EVENT : selected icon
icons.forEach(icon => {
    icon.addEventListener('click', () => {
        //loops through all icons and removes the 'selected' class from each one it's applied to
        ui.removeSelectedIcon();
        //adds the 'selected' class to the most recently selected icon
        icon.classList.add('selected');
    })
})

//EVENT : Add new habit button
addBtn.addEventListener('click', ()=> {
    const habitTitle = newHabitTitle.value;
    let habitIcon;

    //check which icon is selected
    icons.forEach(icon => {
        if(icon.classList.contains('selected')) {
            habitIcon = icon.innerHTML; //capture selected icon's HTML
        };
    });


    const habitID = Math.random(); //generate a unique ID for the habit
    ui.addNewHabit(habitTitle, habitIcon, habitID);
    ui.closeModal(); // close modal after adding habit
    const habit = {
        title: habitTitle,
        icon: habitIcon,
        id: habitID,
        completed: false,
    };
    storage.saveHabit(habit);
})

//EVENT : complete habit
habitContainer.addEventListener('click', e => {
    if(!e.target.classList.contains('habit-btn')) return;
    e.target.classList.toggle('completed');
    storage.habitStatus(e.target.dataset.id);
})

// habits.forEach(habit => {
//     habit.addEventListener('click', () => {
//         habit.classList.toggle('completed');
//     })
// })