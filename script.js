const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsGrid = document.getElementById('resultsGrid');
const loader = document.getElementById('loader');

async function searchNikipedia() {
    const query = searchInput.value.trim();
    if (!query) return;

    // UI Updates
    loader.classList.remove('hidden');
    resultsGrid.innerHTML = '';

    const endpoint = "https://en.wikipedia.org/w/api.php";
    const params = `?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=15&srsearch=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(endpoint + params);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        renderResults(data.query.search);
    } catch (error) {
        console.error("Search error:", error);
        resultsGrid.innerHTML = `<p class="error">Oops! Something went wrong. Please try again.</p>`;
    } finally {
        loader.classList.add('hidden');
    }
}


function renderResults(results) {
    if (results.length === 0) {
        resultsGrid.innerHTML = `<p class="no-results">No matches found for your search.</p>`;
        return;
    }

    results.forEach(result => {
        const pageUrl = `https://en.wikipedia.org/?curid=${result.pageid}`;
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${result.title}</h3>
            <p>${result.snippet}...</p>
            <a href="${pageUrl}" target="_blank" class="read-more">Read Entry →</a>
        `;
        resultsGrid.appendChild(card);
    });
}

searchButton.addEventListener('click', searchNikipedia);


searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchNikipedia();
    }
});