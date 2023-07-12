fetch('https://api.coingecko.com/api/v3/exchange_rates')
  .then(response => response.json())
  .then(data => createDivAndDisplayData(data.rates))
  .catch(error => console.error('Error:', error));

function createDivAndDisplayData(data) {
  const container = document.getElementById('container');
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-text';
  loadingDiv.textContent = 'Loading...';
  container.appendChild(loadingDiv);

  const listDiv = document.createElement('div');
  listDiv.className = 'scrollable-list';
  let lastKey;
  const visibleItemsCount = 4;
  const lazyLoadThreshold = 200;
  let visibleRangeStart = 0;
  let visibleRangeEnd = visibleItemsCount;
  let isEndOfListVisible = false;

  const lazyLoadItems = () => {
    if (visibleRangeEnd >= Object.keys(data).length) {
      if (!isEndOfListVisible) {
        const endOfListDiv = document.createElement('div');
        endOfListDiv.className = 'list-item end-of-list';
        endOfListDiv.textContent = 'End of List';
        listDiv.appendChild(endOfListDiv);
        isEndOfListVisible = true;
      }
      window.removeEventListener('scroll', lazyLoadItems);
      return;
    }

    const isBottomReached = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - lazyLoadThreshold);
    if (isBottomReached) {
      const newRangeEnd = Math.min(visibleRangeEnd + visibleItemsCount, Object.keys(data).length);

      for (let i = visibleRangeStart; i < newRangeEnd; i++) {
        const key = Object.keys(data)[i];
        const item = data[key];
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        const logoDiv = document.createElement('div');
        logoDiv.className = 'logo';
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        const rateH2 = document.createElement('h2');
        const roundedValue = item.value.toFixed(2);
        const formattedValue = parseFloat(roundedValue).toLocaleString();
        rateH2.textContent = `${key}: ${formattedValue}`;
        const nameP = document.createElement('p');
        nameP.textContent = `Crypto name: ${item.name}`;
        const unitP = document.createElement('p');
        unitP.textContent = `Crypto unit: ${item.unit}`;
        contentDiv.appendChild(rateH2);
        contentDiv.appendChild(nameP);
        contentDiv.appendChild(unitP);
        listItem.appendChild(logoDiv);
        listItem.appendChild(contentDiv);
        listDiv.appendChild(listItem);
        lastKey = key;
      }

      visibleRangeStart = newRangeEnd;
      visibleRangeEnd = newRangeEnd + visibleItemsCount;
    }
  };

  window.addEventListener('scroll', lazyLoadItems);

  setTimeout(() => {
    container.removeChild(loadingDiv);
    container.appendChild(listDiv);

    lazyLoadItems();
  }, 1000);
}
