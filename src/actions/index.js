import {ADD_REMINDER} from '../constans';

export const addReminder = (text, dueDate) => {
    const action = {
        type: ADD_REMINDER,
        text,
        dueDate
    };
    console.log('action in addReminder', action);
    return action;
}

// 2. Add actions to throw them to reducers
