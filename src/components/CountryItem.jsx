import styles from './CountryItem.module.css'

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        {country.emoji && (
          <img
            src={`https://flagcdn.com/36x27/${country.emoji.toLocaleLowerCase()}.png`}
            alt=""
          />
        )}
      </span>
      <span>{country.country}</span>
    </li>
  )
}

export default CountryItem
