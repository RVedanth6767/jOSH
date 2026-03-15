const FIRST_NAMES = ['Aarav', 'Isha', 'Rohan', 'Meera', 'Arjun', 'Priya', 'Vivaan', 'Ananya', 'Kabir', 'Siya'];
const LAST_NAMES = ['Sharma', 'Patel', 'Reddy', 'Iyer', 'Kapoor', 'Gupta', 'Nair', 'Singh', 'Mehta', 'Joshi'];
const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Kochi'];
const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'Finance', 'HR', 'Support'];
const STATUSES = ['Active', 'On Leave', 'Probation'];

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const generateEmployees = (count = 1200) => {
  return Array.from({ length: count }, (_, index) => {
    const seed = index + 1;
    const firstName = FIRST_NAMES[Math.floor(seededRandom(seed) * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(seededRandom(seed * 2) * LAST_NAMES.length)];
    const city = CITIES[Math.floor(seededRandom(seed * 3) * CITIES.length)];
    const department = DEPARTMENTS[Math.floor(seededRandom(seed * 4) * DEPARTMENTS.length)];
    const status = STATUSES[Math.floor(seededRandom(seed * 5) * STATUSES.length)];
    const performance = Math.floor(seededRandom(seed * 6) * 40) + 60;
    const tenure = Number((seededRandom(seed * 7) * 10).toFixed(1));
    const engagement = Math.floor(seededRandom(seed * 8) * 50) + 50;

    return {
      id: `EMP-${String(seed).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${seed}@example.com`,
      city,
      department,
      status,
      performance,
      tenure,
      engagement,
      manager: `${FIRST_NAMES[Math.floor(seededRandom(seed * 9) * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(seededRandom(seed * 10) * LAST_NAMES.length)]}`
    };
  });
};

export const mockEmployees = generateEmployees();
