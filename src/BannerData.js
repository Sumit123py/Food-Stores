import Image from './img/chiken.png'
import Image1 from './img/burger (1).png'
import Image2 from './img/pizza (1).png'


const BannerData = () => [
    {
        first: 'DELICIOUS',
        second: 'FRIED',
        third: 'CHICKEN',
        fontSize: '7rem',
        foodImage: Image,
        rotate: 'fadeUp 8s 0.5s infinite',
        objectFit: 'cover'
    },
    {
        first: 'HOT SPICY',
        second: 'CHICKEN',
        third: 'BURGER',
        fontSize: '5rem',
        foodImage: Image1,
        rotate: 'fadeUp 8s 0.5s infinite',
        objectFit: 'cover'

    },
    {
        first: 'SUPER',
        second: 'DELICIOUS',
        third: 'PIZZA',
        fontSize: '7rem',
        foodImage: Image2,
        rotate: 'rotateImage 14s linear infinite, fadeUp 8s 0.5s infinite',
        objectFit: 'contain'

    }
]

export default BannerData;