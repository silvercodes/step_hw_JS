/**
 * Current date for rendering
 * @type {Date}
 */
let currentDate = new Date();

/**
 * Parameters for building string of date
 * @type {{month: string, year: string}}
 */
const optionsForHeader = {
	month: 'long',
	year: 'numeric'
};

/**
 * window.onload
 */
window.onload = function () {
	const headerLabel = document.getElementById('headerLabel');
    const now = new Date();

	headerLabel.innerHTML = (now.toLocaleString('en-US', optionsForHeader));

    renderBody();

    // handlers
	document.getElementById('btnLeft').onclick = () => {changeMonth(-1)};
	document.getElementById('btnRight').onclick = () => {changeMonth(1)};
	document.getElementById('btnToday').onclick = () => {
		currentDate = new Date();
		changeMonth(0);
		renderBody();
	};
};


//region functions
/**
 * change current month to next or previous ((1) next, (-1) previous)
 * @param {number} direction
 */
function changeMonth(direction) {
		currentDate.setMonth(currentDate.getMonth() + direction);
    	document.getElementById('headerLabel').innerHTML = (currentDate.toLocaleString('en-US', optionsForHeader));
		renderBody();
	}

/**
 * Calculate number of days in the month of date
 * @param {Date} date
 * @returns {number}
 */
function daysInMonth(date) {
    return 33 - new Date(date.getYear(), date.getMonth(), 33).getDate();
}

/**
 * Render the calendar body
 * @returns {void}
 */
function renderBody() {
	const calendarBody = document.getElementById('calendarContent');

	const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
	const nPrevious = daysInMonth(previousMonth); // number of days in the previous month

	const now = new Date();

	currentDate.setDate(1);
	let firstDay = currentDate.getDay(); 	// day number of the week of the first day of the month
	let nDays = daysInMonth(currentDate); 	// number of days of the month
	let nd = 1; 							// day number

	for(let i = 0; i < 6; i++) {
		for (let j = 0; j < 7; j++) {
			let cell = calendarBody.rows[i].cells[j];

            cell.innerHTML = '';
            cell.classList.remove('cell-inactive', 'cell-now');

			if(i === 0 && (j + 1) < firstDay) {
                cell.innerHTML = nPrevious - firstDay + 2 + j;
                cell.classList.add('cell-inactive');
			}
			else if(i === 0 && (j + 1) >= firstDay) {
                cell.innerHTML = nd++;
			}
			else if(nd <= nDays && i !== 0) {
                cell.innerHTML = nd++;
			}
			else if(nd > nDays) {
                cell.innerHTML = nd++ - nDays;
				cell.classList.add('cell-inactive');
			}
			// today
			if((nd - 1) === now.getDate() && now.getMonth() === currentDate.getMonth() && now.getFullYear() === currentDate.getFullYear()) {
				cell.classList.add('cell-now');
			}

		}
	}
}
//endregion