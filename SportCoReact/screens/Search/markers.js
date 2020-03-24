

const Images = {
    soccer : { image : require('../../assets/images/SoccerField.png') },
    basketball : { image : require('../../assets/images/basketCourt.jpg') },
    futsal : { image : require('../../assets/images/futsal.jpeg') }
}


export const markers = [
    {
        coordinate: {
            latitude: 43.591317, 
            longitude: 7.124781,
        },
        title: "Foot à 8",
        description: "Session de foot à 8 au Fort Carré",
        image: Images.soccer.image,
    },
    {
        coordinate: {
            latitude: 43.5965538,
            longitude: 7.0980908,
        },
        title: "Foot à 5",
        description: "Session de foot à 5 en salle",
        image: Images.futsal.image,
    },
    {
        coordinate: {
            latitude: 43.5769976,
            longitude: 7.1206588,
        },
        title: "Basket à 4",
        description: "Session de basket sur le terrain Foch",
        image: Images.basketball.image,
    }
]