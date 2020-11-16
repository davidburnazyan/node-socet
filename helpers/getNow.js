
function getNow() {
    const today = new Date();
    const Year = today.getFullYear();
    const Day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
    const Month = today.getMonth() < 10 ? `0${today.getMonth()+1}` : today.getMonth()+1;
    const hour = today.getHours();
    const minute = today.getMinutes();
    const seconds = today.getSeconds();
    return `${Year}-${Day}-${Month} ${hour}-${minute}-${seconds}`;
}

module.exports = getNow;