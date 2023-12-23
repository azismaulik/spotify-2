export function getGreeting() {
  const currentTime = new Date().getHours();

  let greeting;

  if (currentTime >= 5 && currentTime < 12) {
    greeting = "Good Morning!";
  } else if (currentTime >= 12 && currentTime < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  return greeting;
}
