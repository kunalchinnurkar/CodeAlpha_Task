// Keys for localStorage
const STORAGE_KEY = "fitnessTrackerData";

// Load data or initialize
let fitnessData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
 activities: [],
 dailyStats: {} // e.g. "2026-09-22": { steps, workouts, calories }
};

const activityForm = document.getElementById("activityForm");
const activitiesList = document.getElementById("activitiesList");
const clearDataBtn = document.getElementById("clearDataBtn");

const totalStepsEl = document.getElementById("totalSteps");
const totalWorkoutsEl = document.getElementById("totalWorkouts");
const totalCaloriesEl = document.getElementById("totalCalories");
const weeklyProgressEl = document.getElementById("weeklyProgress");
const weeklyProgressTextEl = document.getElementById("weeklyProgressText");

function saveData() {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(fitnessData));
}

function getTodayKey() {
 const d = new Date();
 const year = d.getFullYear();
 const month = String(d.getMonth() + 1).padStart(2, "0");
 const day = String(d.getDate()).padStart(2, "0");
 return `${year}-${month}-${day}`;
}

function updateDashboard() {
 const today = getTodayKey();
 const todayStats = fitnessData.dailyStats[today] || { steps: 0, workouts: 0, calories: 0 };

 totalStepsEl.textContent = todayStats.steps;
 totalWorkoutsEl.textContent = todayStats.workouts;
 totalCaloriesEl.textContent = todayStats.calories;

 // Weekly progress: count how many of last 7 days have any activity
 const dates = [];
 const d = new Date();
 for (let i = 6; i >= 0; i--) {
 const date = new Date(d);
 date.setDate(d.getDate() - i);
 const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
 dates.push(key);
 }

 let activeDays = 0;
 dates.forEach(key => {
 if (fitnessData.dailyStats[key] && fitnessData.dailyStats[key].workouts > 0) {
 activeDays++;
 }
 });

 const percent = (activeDays / 7) * 100;
 weeklyProgressEl.style.width = `${percent}%`;
 weeklyProgressTextEl.textContent = `${activeDays} / 7 days active`;
}

function renderActivities() {
 activitiesList.innerHTML = "";
 // Show last 10 activities, newest first
 const recent = fitnessData.activities.slice(-10).reverse();
 if (recent.length === 0) {
 const li = document.createElement("li");
 li.textContent = "No activities logged yet.";
 activitiesList.appendChild(li);
 return;
 }

 recent.forEach(act => {
 const li = document.createElement("li");
 li.textContent = `${act.date} – ${act.type} | ${act.duration} min | ${act.calories} kcal${act.steps ? ` | ${act.steps} steps` : ""}`;
 activitiesList.appendChild(li);
 });
}

function addActivity(type, duration, calories, steps) {
 const today = getTodayKey();

 const activity = {
 type,
 duration: Number(duration),
 calories: Number(calories),
 steps: Number(steps) || 0,
 date: today
 };

 fitnessData.activities.push(activity);

 if (!fitnessData.dailyStats[today]) {
 fitnessData.dailyStats[today] = { steps: 0, workouts: 0, calories: 0 };
 }

 fitnessData.dailyStats[today].workouts += 1;
 fitnessData.dailyStats[today].calories += activity.calories;
 fitnessData.dailyStats[today].steps += activity.steps;

 saveData();
 updateDashboard();
 renderActivities();
}

activityForm.addEventListener("submit", (e) => {
 e.preventDefault();

 const type = document.getElementById("activityType").value;
 const duration = document.getElementById("duration").value;
 const calories = document.getElementById("calories").value;
 const steps = document.getElementById("steps").value;

 if (!duration || !calories) {
 alert("Please fill in duration and calories.");
 return;
 }

 addActivity(type, duration, calories, steps);
 activityForm.reset();
});

clearDataBtn.addEventListener("click", () => {
 if (confirm("Clear all fitness data? This cannot be undone.")) {
 fitnessData = { activities: [], dailyStats: {} };
 saveData();
 updateDashboard();
 renderActivities();
 }
});

// Initialize
updateDashboard();
renderActivities();
