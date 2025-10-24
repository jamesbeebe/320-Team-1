import ical from 'node-ical';
const data = ical.sync.parseFile('test.ics');
let classArray = [];
let i = 0;
for (const [key, event] of Object.entries(data)) {
  if (event.type === 'VEVENT') {
    console.log('Event summary:', event.summary);
    classArray[i] = event.summary.split('-')[0].trim();
    console.log('Start:', event.start);
    console.log('Duration:', event.duration);
    console.log('Location:', event.location);
    console.log('Recurrence rule:', event.rrule?.toString());
    console.log('----------------------------');
  }
  i++;
}
const uniqueArray = classArray.reduce((acc, item) => {
  if (!acc.includes(item)) acc.push(item);
  return acc;
}, []);
console.log(uniqueArray);
