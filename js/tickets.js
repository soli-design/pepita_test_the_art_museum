
let dateselect_selector = document.querySelector('#dateselection');
let indicator = dateselect_selector.querySelector('.indicator');
let dateselect_buttons = document.querySelectorAll('label');
let infoOptions = [];
Array.from(dateinfo.children).forEach(el =>{
    infoOptions.push({opt: el.id, el});
})

// opening times and date display
let can_buy_ticket = true;
function cantBuyTicket(message){
    formErrorField.innerText = message;
    formErrorField.classList.add('show');
    can_buy_ticket = false;
}
function clearErrorMessage(){
    formErrorField.innerText = "";
    formErrorField.classList.remove('show');
    can_buy_ticket = true;
}
let openingTimes = {
    "1" : {"from"   : "10:30am", "till"    : "5:30pm"},
    "2" : {"from"   : "10:30am", "till"    : "5:30pm"},
    "3" : {"from"   : "10:30am", "till"    : "5:30pm"},
    "3" : {"from"   : "10:30am", "till"    : "5:30pm"},
    "4" : {"from"   : "10:30am", "till"    : "5:30pm"},
    "5" : {"from"   : "10:30am", "till"    : "5:30pm"},
    "6" : "closed",
    "7" : "closed",
}
function dateMagic(time, setting = "all") {

    let dateOptions = {
    //   weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    let today = new Date(time);
    let actual_today = new Date();

    if(setting === "tomorrow"){
        let newDateString = `${today.getFullYear()}. ${today.getMonth()+1}. ${today.getDate()+1}`;
        today = new Date(newDateString);
    }

    //  Opening times logic
    let weekday = openingTimes[(today.getUTCDay()==0)? 7 : today.getUTCDay()];
    
    let closingTime = null;
    if(Object.keys(weekday).includes("from")){
        let timeString = weekday["till"]; // "5:30pm"

        let match = timeString.match(/(\d+):(\d+)(am|pm)/i);

        let hours = parseInt(match[1]);
        let minutes = parseInt(match[2]);
        let meridiem = match[3].toLowerCase();

        if (meridiem === "pm" && hours !== 12) {
            hours += 12;
        }
        if (meridiem === "am" && hours === 12) {
            hours = 0;
        }

        closingTime = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            hours,
            minutes
        );
    }

    
    let open_string;
    let _tmp_today_0 = new Date(today.setHours(0,0,0,0));
    let _tmp_actoday_0 = new Date(actual_today.setHours(0,0,0,0));

    if (today.getFullYear() == 1970) {
        open_string = " ";
    } else if (_tmp_today_0 < _tmp_actoday_0) {
        open_string = "Please pick a date in the future!";
        cantBuyTicket("Please choose a date when we can expect you. Currently our Tardis is out of service.")
    } else if (closingTime != null && actual_today < closingTime){
            open_string = `Open ${weekday["from"]}-${weekday["till"]}`;
            clearErrorMessage();
    } else {
        open_string = `Sorry, we are closed.`;
        cantBuyTicket("Please choose a date when we are open to reserve your tickets!");
    }

    switch (setting) {
        case "today":
            info_today.innerHTML = `${today.toLocaleDateString(navigator.language, dateOptions)}<br>${open_string}`;
            break;
        case "tomorrow":
            info_tomorrow.innerHTML = `${today.toLocaleDateString(navigator.language, dateOptions)}<br>${open_string}`;
            break;
        case "other":
            info_other_open.innerHTML = `${open_string}`;
            break;
    
        default:
            info_today.innerHTML = `${today.toLocaleDateString(navigator.language, dateOptions)}<br>${open_string}`;
            info_tomorrow.innerHTML = `${today.toLocaleDateString(navigator.language, dateOptions)}<br>${open_string}`;
            info_other_open.innerHTML = `${open_string}`;
            break;
    }
} dateMagic(Date.now(), "tomorrow");

customDate.addEventListener('change',(e)=>{dateMagic(e.target.value, "other")});


function moveIndicatorAndInfo(target) {

    indicator.style.width = `${target.offsetWidth}px`;
    indicator.style.transform = `translateX(${target.offsetLeft}px)`;

    console.log(target);
    switch (target.querySelector('input[type="radio"').value) {
        case "today":
            dateMagic(Date.now(), "today");
            break;
        case "tomorrow":
            dateMagic(Date.now(), "tomorrow");
            break;
        case "other":
            dateMagic(customDate.valueAsDate, "other");
            break;
    
        default:
            console.log('moveIndicatorAndInfo :: target error');
            break;
    }

    infoOptions.forEach(o =>{
        if(!o.opt.includes(target.querySelector('input[type="radio"').value)) o.el.classList.remove('show');
        else o.el.classList.add('show');
    })
}

dateselect_buttons.forEach(button => {
    button.addEventListener('click', () => {
        dateselect_selector.querySelector('.active')?.classList.remove('active');

        button.classList.add('active');

        moveIndicatorAndInfo(button);
    });
});

moveIndicatorAndInfo(document.querySelector('label.active'));

// ticket amounts and calculations
let ticketTypes = document.querySelectorAll('.ticket_type_wrap');
const pricing = {
    "adult"     : 8,
    "senior"    : 4,
    "student"   : 2
}
const ticket_amount_inputs = {
    "adult"     : {
        "target": document.getElementById('adult_ticket_amount'),
        "more"  : document.getElementById('btn_om_adult'),
        "less"  : document.getElementById('btn_ol_adult')
    },
    "senior"     : {
        "target": document.getElementById('senior_ticket_amount'),
        "more"  : document.getElementById('btn_om_senior'),
        "less"  : document.getElementById('btn_ol_senior')
    },
    "student"     : {
        "target": document.getElementById('student_ticket_amount'),
        "more"  : document.getElementById('btn_om_student'),
        "less"  : document.getElementById('btn_ol_student')
    },
}

// TICKET AMOUNT CHANGE EVENTS
Object.keys(ticket_amount_inputs).forEach(tier=>{
    // add button
    ticket_amount_inputs[tier].more.addEventListener('click', ()=>changeTicketAmount(ticket_amount_inputs[tier].target, "+"));
    // subtract button
    ticket_amount_inputs[tier].less.addEventListener('click', ()=>changeTicketAmount(ticket_amount_inputs[tier].target, "-"));
    // direct input change
    ticket_amount_inputs[tier].target.addEventListener('change',()=>calcTicketsTotal());
})

function calcTicketsTotal(){
    // ez most csak a látványmegoldásra. Amúgy is a szervernek kell visszaellenőriznie és számolnia...
    if(adult_ticket_amount.value < 0) adult_ticket_amount.value = 0;
    if(senior_ticket_amount.value < 0) senior_ticket_amount.value = 0;
    if(student_ticket_amount.value < 0) student_ticket_amount.value = 0;

    total.querySelector('output').innerText =
            (adult_ticket_amount.value   * pricing.adult +
             senior_ticket_amount.value  * pricing.senior +
             student_ticket_amount.value * pricing.student);
}

function changeTicketAmount(target, operation){
    let value = Number.parseInt(target.value);

    switch (operation) {
        case "+":   value ++;   break;
        case "-":   value --;   break;           
        default:    console.error("wrong operation"); break;
    }
    if (value <= 0) {
        value = 0;
        target.classList.add('color-secondary-faint');
    } else if(target.className.includes('color-secondary-faint')) {
        target.classList.remove('color-secondary-faint');
    };

    target.value = value;

    calcTicketsTotal();
}


// test functions
// use test date input field
document.getElementById("dateTest").addEventListener('change',(e)=>{dateMagic(e.target.value, "all");})
// dateselector test
function logFieldsetState(e, parentFieldset){
    e.preventDefault();

    Array.from(parentFieldset).forEach(inp => {
        if(inp.localName == "input") console.log(inp.name + "\t" + inp.id + "\t" + inp.checked);
    })
}