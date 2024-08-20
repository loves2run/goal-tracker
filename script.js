//QUERY SELECTORS
const habits = document.querySelectorAll('.habit-btn');
const themeBtn = document.querySelector('#theme');
const modalContainer = document.querySelector('.modal-container');
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
    }
}

//EVENT LISTENERS

//EVENT: window load
window.addEventListener('DOMContentLoaded', () => {
    //load theme
    const theme = storage.checkTheme();
    if (theme === 'dark') ui.theme();
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

//DELETE... EVENTUALLY
habits.forEach(habit => {
    habit.addEventListener('click', () => {
        habit.classList.toggle('completed');
    })
})