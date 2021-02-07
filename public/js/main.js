import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';

(async () => {
    const countText = document.getElementById('count-text');
    const countWorkTime = document.getElementById('count-work-time');

    const res = await fetch('/api/count');
    const count = await res.text();
    countText.innerText = count;

    const workStartTime = (new Date()).getTime();

    const countWorkTimeTimer = setInterval(() => {
        const currentTime = (new Date()).getTime();
        const diffTime = new Date(currentTime - workStartTime);
        countWorkTime.innerText = diffTime.toISOString().substr(11, 8);
    }, 1000);
    const countTextTimer = setInterval(async () => {
        const res = await fetch('/api/count');
        const count = await res.text();
        countText.innerText = count;
    }, 10 * 1000);
})();
