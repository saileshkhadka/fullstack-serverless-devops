async function getData() {
    const response = await fetch('/getData');
    const data = await response.json();
    document.getElementById('data').innerText = JSON.stringify(data);
}