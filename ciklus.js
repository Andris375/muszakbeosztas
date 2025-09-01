// ---- Segédfüggvény: dátum formázása YYYY-MM-DD formátumban ----
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0'); // +1, mert hónap 0-tól
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ---- 1. Műszak generálása ----
function generateSchedule(start, end) {
  const pattern = [
    ["délután", 6],
    ["pihenőnap", 2],
    ["hajnal", 6],
    ["pihenőnap", 2],
    ["éjszaka", 6],
    ["pihenőnap", 2],
  ];

  const schedule = {};
  let current = new Date(start);
  const endDate = new Date(end);
  let patternIndex = 0;

  while (current <= endDate) {
    const [shiftName, days] = pattern[patternIndex];
    for (let i = 0; i < days; i++) {
      if (current > endDate) break;
      const dateStr = formatDate(current);
      schedule[dateStr] = shiftName;
      current.setDate(current.getDate() + 1);
    }
    patternIndex = (patternIndex + 1) % pattern.length;
  }
  return schedule;
}

// ---- 2. Naptár megjelenítése ----
const honapNevek = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December"
];

function renderCalendar(year, month, schedule) {
  document.getElementById("month-year").textContent = `${honapNevek[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const highlightDate = "2025-09-07"; // kezdődátum
  const today = formatDate(new Date()); // mai nap

  let html = "<table><tr>" +
             "<th>H</th><th>K</th><th>Sze</th><th>Cs</th><th>P</th><th>Szo</th><th>V</th>" +
             "</tr><tr>";

  for (let i = 1; i < startDay; i++) {
    html += "<td></td>";
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dateStr = formatDate(currentDate);
    const shift = schedule[dateStr] || "";

    let classes = shift;
    if(dateStr === highlightDate) classes += " start-day";
    if(dateStr === today) classes += " today";

    html += `<td class="${classes}"><span class="day-number">${day}</span>${shift}</td>`;

    const weekday = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
    if (weekday === 7 && day !== daysInMonth) {
      html += "</tr><tr>";
    }
  }

  const lastWeekday = lastDay.getDay() === 0 ? 7 : lastDay.getDay();
  for (let i = lastWeekday; i < 7; i++) {
    html += "<td></td>";
  }

  html += "</tr></table>";
  document.getElementById("calendar").innerHTML = html;
}

// ---- 3. Lapozás ----
const startDate = new Date("2025-09-07"); 
let currentYear = new Date().getFullYear();      // mindig a mai év
let currentMonth = new Date().getMonth();        // mindig a mai hónap

const schedule = generateSchedule("2025-09-07", "2027-12-31"); // a teljes ciklus (eddig a dátumig megy)

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentYear, currentMonth, schedule);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth, schedule);
}

// ---- 4. Betöltéskor futtatás ----
renderCalendar(currentYear, currentMonth, schedule);
