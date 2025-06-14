import React, { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState('');

  const handleFileUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const json = JSON.parse(event.target.result);
      const listings = parseData(json);
      setData(listings);
    };
    fileReader.readAsText(e.target.files[0]);
  };

  const parseData = (rawData) => {
    const result = [];
    Object.values(rawData).forEach((entry) => {
      const goofish = entry['Goofish Data'];
      const ebay = entry['eBay Data'];
      const goofishPrice = parseFloat(goofish.Price);
      const goofishPriceUSD = goofishPrice * 0.14; // ~Conversion rate

      Object.entries(ebay).forEach(([title, details]) => {
        const ebayPrice = parseFloat(details.Price);
        const priceDiff = (((ebayPrice - goofishPriceUSD) / goofishPriceUSD) * 100).toFixed(2);
        result.push({
          title,
          image: details.img_link,
          ebayLink: details.listing_link,
          ebayPrice,
          goofishLink: goofish.listing_link,
          goofishPrice: goofishPriceUSD.toFixed(2),
          priceDiff,
        });
      });
    });
    return result;
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortType === 'profit') return b.priceDiff - a.priceDiff;
    if (sortType === 'low') return a.ebayPrice - b.ebayPrice;
    if (sortType === 'high') return b.ebayPrice - a.ebayPrice;
    return 0;
  });

  return (
    <div className="App">
      <h1>Listing Dashboard</h1>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      <div className="controls">
        <button onClick={() => setSortType('profit')}>Sort by Profit %</button>
        <button onClick={() => setSortType('low')}>Sort by Lowest Price</button>
        <button onClick={() => setSortType('high')}>Sort by Highest Price</button>
        <button onClick={() => setData([])}>Reload</button>
      </div>
      <div className="cards">
        {sortedData.map((item, idx) => (
          <div className="card" key={idx}>
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>eBay Price: ${item.ebayPrice}</p>
            <p>Goofish Price: ${item.goofishPrice} USD</p>
            <p>Profit Diff: {item.priceDiff}%</p>
            <a href={item.ebayLink} target="_blank" rel="noopener noreferrer">eBay Link</a><br />
            <a href={item.goofishLink} target="_blank" rel="noopener noreferrer">Goofish Link</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
