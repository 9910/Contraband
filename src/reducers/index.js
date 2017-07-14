import {ADD_REMINDER} from '../constans';
import {bake_cookie, read_cookie} from 'sfcookies';

const reminder = (action) => {
    let {text, dueDate} = action;
    return {
        id: Math.random(),
        text,
        dueDate
    }
}

const removeById = (state = [], id) => {
    const reminders = state.filter(reminder => reminder.id !== id);
    console.log('new reduced reminders', reminders);
    return reminders;
}

// 3. Add reducers to work with actions
const reminders = (state = [], action) => {
    let reminders = null;
    state = read_cookie('reminders');
    switch (action.type) {
        case ADD_REMINDER:
            reminders = [...state, reminder(action)]
            bake_cookie('reminders', reminders);
            return reminders;
        default:
            return state;
    }
}

export default reminders;