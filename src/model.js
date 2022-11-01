'use strict'
class Contestant {
    constructor(id) {
        this.id = id;
        this.name = nameGenerator();
        this.surname = nameGenerator();
    }
    doStage() {
        return Math.floor(Math.random() * 11) + 10; //случайное целое число от 10 до 20
    }
}
class Country {
    constructor(countryId, contestantId) {
        this.id = countryId;
        this.name = nameGenerator();
        this.contestants = new Array(4);
        for(let i = 0; i < 4; i++)
            this.contestants[i] = new Contestant(contestantId++);
    }
}
class RatingTracker {
    //Init
    constructor(numberOfCountries, numberOfStages) {
        this.countries = new Array(numberOfCountries);
        this.stages = numberOfStages;
        let contestantId = 1;
        for(let i = 0; i < numberOfCountries; i++) {
            this.countries[i] = new Country(i + 1, contestantId);
            contestantId += 4;
        }
    }
    //сравнивает две страны, используется в методе sort()
    lap1Compare(country1, country2) {
        if(country1.lap1PlaceSum != country2.lap1PlaceSum) {
            return country1.lap1PlaceSum - country2.lap1PlaceSum;
        } else {
            //определяет страну с лучшим персональным рейтингом
            //(при равенсте самых лучших участников сравниваются 2-е лучшие и т.д.)
            let country1Places = country1.contestants.map((contestant) => {return contestant.lap1Place;});
            let country2Places = country2.contestants.map((contestant) => {return contestant.lap1Place;});
            country1Places.sort((a, b) => {return a - b;});
            country2Places.sort((a, b) => {return a - b;});
            for(let i = 0; i < 4; i++)
                if(country1Places[i] != country2Places[i])
                    return country1Places[i] - country2Places[i];
            return 0;
        }
    }
    //сравнивает две страны, используется в методе sort()
    lap2Compare(country1, country2) {
        if(country1.lap2PlaceSum != country2.lap2PlaceSum) {
            return country1.lap2PlaceSum - country2.lap2PlaceSum;
        } else {
            return country1.lap2AveragePlaces - country2.lap2AveragePlaces;
        }
    }
    //вычисляет рейтинг по странам и участникам
    doLap1() {
        this.lap1CountryRating = [];
        this.lap1PersonalRating = [];
        //генерирует случайное чило для каждого этапа каждого участника каждой страны
        //и одновременно составляет неотсортированный рейтинг участников и стран
        for(let i = 0; i < this.countries.length; i++) {
            this.lap1CountryRating[i] = this.countries[i];
            this.lap1CountryRating[i].lap1PlaceSum = 0;
            for(let j = 0; j < 4; j++) {
                this.countries[i].contestants[j].lap1Stages = [];
                this.countries[i].contestants[j].lap1Sum = 0;
                for(let k = 0; k < this.stages; k++) {
                    let stage = this.countries[i].contestants[j].doStage(); //результат этапа
                    this.countries[i].contestants[j].lap1Stages[k] = stage;
                    this.countries[i].contestants[j].lap1Sum += stage;
                }
                this.lap1PersonalRating.push(this.countries[i].contestants[j]);
            }
        }
        //сортирует всех участников по общему времени и присваивает место в рейтинге
        this.lap1PersonalRating.sort((a, b) => {return a.lap1Sum - b.lap1Sum;});
        this.lap1PersonalRating[0].lap1Place = 1;
        let placeCounter = 1;
        for(let i = 1; i < this.lap1PersonalRating.length; i++) {
            if(this.lap1PersonalRating[i].lap1Sum != this.lap1PersonalRating[i - 1].lap1Sum)
                placeCounter++;
            this.lap1PersonalRating[i].lap1Place = placeCounter;
        }
        //вычисляет место страны для каждого этапа и складывает их вместе для всего круга
        for(let k = 0; k < this.stages; k++) {
            let stageRating = [];
            for(let i = 0; i < this.countries.length; i++) {
                let worstScore = 0;
                for(let j = 0; j < 4; j++)
                    if(this.countries[i].contestants[j].lap1Stages[k] > worstScore)
                        worstScore = this.countries[i].contestants[j].lap1Stages[k];
                stageRating[i] = {country: this.countries[i], worstScore: worstScore};
            }
            stageRating.sort((a, b) => {return a.worstScore - b.worstScore;});
            let place = 0;
            let previousScore = 0;
            for(let stageResult of stageRating) {
                if(stageResult.worstScore != previousScore)
                    place++;
                stageResult.country.lap1PlaceSum += place;
                previousScore = stageResult.worstScore;
            }

        }
        //сортирует рейтинг стран, используя функцию lap1Compare, и присваивает места
        this.lap1CountryRating.sort(this.lap1Compare);
        this.lap1CountryRating[0].lap1Place = 1;
        placeCounter = 1;
        for(let i = 1; i < this.lap1CountryRating.length; i++) {
            if(this.lap1Compare(this.lap1CountryRating[i], this.lap1CountryRating[i - 1]))
                placeCounter++;
            this.lap1CountryRating[i].lap1Place = placeCounter;
        }
        this.lap1Winners = this.lap1CountryRating.slice(0, 4);
    }
    //вычисляет рейтинг по странам и участникам
    doLap2() {
        this.lap2CountryRating = [];
        this.lap2PersonalRating = [];
        //генерирует случайное чило для каждого этапа каждого участника каждой страны
        //и одновременно составляет неотсортированный рейтинг участников и стран
        for(let i = 0; i < this.lap1Winners.length; i++) {
            this.lap2CountryRating[i] = this.lap1Winners[i];
            this.lap2CountryRating[i].lap2PlaceSum = 0;
            for(let j = 0; j < 4; j++) {
                this.lap1Winners[i].contestants[j].lap2Stages = [];
                this.lap1Winners[i].contestants[j].lap2Sum = 0;
                for(let k = 0; k < this.stages; k++) {
                    let stage = this.countries[i].contestants[j].doStage(); //результат этапа
                    this.lap1Winners[i].contestants[j].lap2Stages[k] = stage;
                    this.lap1Winners[i].contestants[j].lap2Sum += stage;
                }
                this.lap2PersonalRating.push(this.lap1Winners[i].contestants[j]);
            }
        }
        //сортирует всех участником по общему времени и присваивает место в рейтинге
        this.lap2PersonalRating.sort((a, b) => {return a.lap2Sum - b.lap2Sum;});
        this.lap2PersonalRating[0].lap2Place = 1;
        let placeCounter = 1;
        for(let i = 1; i < this.lap2PersonalRating.length; i++) {
            if(this.lap2PersonalRating[i].lap2Sum != this.lap2PersonalRating[i - 1].lap2Sum)
                placeCounter++;
            this.lap2PersonalRating[i].lap2Place = placeCounter;
        }
        //вычисляет место страны для каждого этапа и складывает их вместе для всего круга
        for(let k = 0; k < this.stages; k++) {
            let stageRating = [];
            for(let i = 0; i < this.lap1Winners.length; i++) {
                let bestScore = 100;
                for(let j = 0; j < 4; j++)
                    if(this.lap1Winners[i].contestants[j].lap2Stages[k] < bestScore)
                        bestScore = this.lap1Winners[i].contestants[j].lap2Stages[k];
                stageRating[i] = {country: this.lap1Winners[i], bestScore: bestScore};
                stageRating.sort((a, b) => {return a.bestScore - b.bestScore;});
                let place = 0;
                let previousScore = 0;
                for(let stageResult of stageRating) {
                    if(stageResult.bestScore != previousScore)
                        place++;
                    stageResult.country.lap2PlaceSum += place;
                    previousScore = stageResult.bestScore;
                }
            }
        }
        //сортирует рейтинг стран, используя функцию lap2Compare, и присваивает места
        for(let country of this.lap2CountryRating)
            country.lap2AveragePlaces = country.contestants.reduce((sum, contestant) =>
            {return sum += contestant.lap2Place;}, 0) / 4;
        this.lap2CountryRating.sort(this.lap2Compare);
        this.lap2CountryRating[0].lap2Place = 1;
        placeCounter = 1;
        for(let i = 1; i < this.lap2CountryRating.length; i++) {
            if(this.lap2Compare(this.lap2CountryRating[i], this.lap2CountryRating[i - 1]))
                placeCounter++;
            this.lap2CountryRating[i].lap2Place = placeCounter;
        }
    }
    //возвращает рейтинг стран и участников 1 круга
    getLap1Data() {
        let rating = {
            countries: [],
            contestants: [],
        }
        for (let country of this.lap1CountryRating) {
            let ratingRecord = {
                place: country.lap1Place,
                id: country.id,
                name: country.name,
                placeSum: country.lap1PlaceSum,
                contestantPlaces: country.contestants.reduce((str, contestant) => {return str + contestant.lap1Place + " "}, ""),
            }
            rating.countries.push(ratingRecord);
        }
        for (let contestant of this.lap1PersonalRating) {
            let ratingRecord = {
                place: contestant.lap1Place,
                id: contestant.id,
                name: contestant.name,
                surname: contestant.surname,
                lapSum: contestant.lap1Sum,
            }
            rating.contestants.push(ratingRecord);
        }
        return rating;
    }

    //возвращает рейтинг стран и участников 2 круга
    getLap2Data() {
        let rating = {
            countries: [],
            contestants: [],
        }
        for (let country of this.lap2CountryRating) {
            let ratingRecord = {
                place: country.lap2Place,
                id: country.id,
                name: country.name,
                placeSum: country.lap2PlaceSum,
                meanPlace: country.lap2AveragePlaces,
            }
            rating.countries.push(ratingRecord);
        }
        for (let contestant of this.lap2PersonalRating) {
            let ratingRecord = {
                place: contestant.lap2Place,
                id: contestant.id,
                name: contestant.name,
                surname: contestant.surname,
                lapSum: contestant.lap2Sum,
            }
            rating.contestants.push(ratingRecord);
        }
        return rating;
    }
}
//генерирует случайное имя
function nameGenerator() {
    const vowels = ['а','е','и','о','у'/*,'ы','э'*/];
    const consonants = ['б','в','г','д','к','л','м','н','п','р','с','т'/*,'ж','з','ф','х','ц','ч','ш'*/];
    let str = [];
    let length = Math.floor(Math.random() * 7) + 4;  //случайное целое число от 4 до 10
    if(Math.random() < 0.5) {
        str[0] = vowels[Math.floor(Math.random() * vowels.length)];
        length--;
    }
    for(let i = 0; i < length; i++) {
        if(i % 2 == 0) {
            str.push(consonants[Math.floor(Math.random() * consonants.length)]);
            if(Math.random() < 0.5) {
                str.push(consonants[Math.floor(Math.random() * consonants.length)]);
                length--;
            }
        } else {
            str.push(vowels[Math.floor(Math.random() * vowels.length)]);
        }
    }
    str[0] = str[0].toUpperCase();
    return str.join("");
}