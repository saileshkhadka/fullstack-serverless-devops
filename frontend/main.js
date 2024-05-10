async function handler() {
    const response = await fetch('/handler');
    const data = await response.json();
    document.getElementById('data').innerText = JSON.stringify(data);
}