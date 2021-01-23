import React, {useEffect, useState} from 'react';
import './App.css';

/**
 * Get image date closest to birthday.
 * If exact match exists, return most recent birthday and empty string.
 * If exact match does not exist, return closest match after most recent birthday
 * and human readable version of closest match.
 */
export const getNearestDate = (birthdate, imageDates) => {
    const lastImageDate = imageDates[0];
    const month = birthdate.slice(5,7);
    const day = birthdate.slice(8,10);
    const lastImageYear = lastImageDate.slice(0,4);
    const birthdayThisYear = `${lastImageYear}-${month}-${day}`;
    const birthdayLastYear = `${lastImageYear-1}-${month}-${day}`;
    const lastBirthday = birthdayThisYear <= lastImageDate ? birthdayThisYear : birthdayLastYear;

    for (let i = 0; i < imageDates.length; i ++) {
      if (lastBirthday === imageDates[i]) {
        return [imageDates[i], ''];
      }
      if (lastBirthday > imageDates[i]) {
        const closest = imageDates[i-1]
        return [closest, `${closest.slice(5,7)}-${closest.slice(8,10)}-${closest.slice(0,4)}`]
      }
    }
  }

export const increment = (index, cycle) => (index + 1) % cycle;

export const decrement = (index, cycle) => (index + cycle - 1) % cycle;

export default function App() {
  const [birthdate, setBirthdate] = useState('2020-02-20');
  const [imageUrls, setImageUrls] = useState(['https://epic.gsfc.nasa.gov/archive/natural/2020/02/20/png/epic_1b_20200220140249.png']);
  const [imageDates, setImageDates] = useState([]);
  const [closestMatch, setClosestMatch] = useState('');
  const [index, setIndex] = useState(0);

  const handleChangeDate = (event) => setBirthdate(event.target.value);
  const handleClickRight = () => setIndex(increment(index, imageUrls.length));
  const handleClickLeft = () => setIndex(decrement(index, imageUrls.length));

  /**
   * We get the first 366 dates, representing the worst-case scenario of having a photo every day and
   * being in a leap year. A cursory look at the API response shows there are only a few dates that lack
   * a photo. We could filter the dates by the criteria of being less than or equal to the current date
   * minus one year, but that would only save us a few iterations through the dates array, and it would
   * increase the time spent per iteration.
   */
  useEffect(()=>{
    const fetchImageDates = async () => {
      const res = await fetch('https://epic.gsfc.nasa.gov/api/natural/all');
      const dates = await res.json();
      setImageDates(dates.slice(0, 366).map(({date}) => date))
    };
    fetchImageDates();
  }, [])

  // Fetch the images corresponding to a date
  const getNewImageUrls = async(date) => {
    const dateWithSlashes = date.replace(/-/g, '/');
    const res = await fetch(`https://epic.gsfc.nasa.gov/api/natural/date/${date}`);
    const images = await res.json();
    return images.map(({image}) => `https://epic.gsfc.nasa.gov/archive/natural/${dateWithSlashes}/png/${image}.png`)
  }

  const handleSubmit = async() => {
    const [nearestDate, closest] = getNearestDate(birthdate, imageDates);
    setClosestMatch(closest);
    const newUrls = await getNewImageUrls(nearestDate);
    setImageUrls(newUrls);
  };

  return (
      <div className="app-container">
        {closestMatch
          ? <h2>{`Closest Date Match: ${closestMatch}`}</h2>
          : <h2>B<span className="highlight">earth</span>day!</h2>}
        <div className="carousel">
          {imageUrls.length > 1 && <button onClick={handleClickLeft} className="carousel-button" data-testid="left-button">{"<"}</button>}
          <img src={imageUrls[index]} alt="earth" />
          {imageUrls.length > 1 && <button onClick={handleClickRight} className="carousel-button" data-testid="right-button">{">"}</button>}
        </div>
        <h5>{`Image ${index+1} of ${imageUrls.length}`}</h5>
        <p>Enter your birthdate and we'll find a photo of earth taken on your most recent birthday, or the closest date match if no photo was taken on your birthday.</p>
        <p>Depending on your birthday, there might be multiple photos from that day.</p>
        <div className="input-container">
          <input
            type="date"
            value={birthdate}
            min="1900-01-01" max={imageDates[0]}
            onChange={handleChangeDate}
            data-testid="date-picker"
          />
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>
      </div>
  );
}
