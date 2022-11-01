class CompetitionView {
    #controller;
    #container;
    constructor() {
        this.#container = document.getElementById('container');
        this.#controller = new CompetitionController();
    }

    init() {
        //initial state of the page
        const header = document.createElement('h1');
        header.innerText = 'Велогонка';
        this.#container.append(header);
        let label;
        let input;
        label = document.createElement('label');
        label.innerText = 'Количество стран:';
        input = document.createElement('input');
        input.id = "countries";
        input.type = "number";
        label.appendChild(input);
        this.#container.append(label);
        label = document.createElement('label');
        label.innerText = 'Количество этапов:';
        input = document.createElement('input');
        input.id = "stages";
        input.type = "number";
        label.appendChild(input);
        this.#container.append(label);
        const button = document.createElement('button');
        button.innerText = 'Начать 1й раунд!';
        button.id = 'startCompetitionButton';
        button.onclick = () => this.#buttonClick1();
        this.#container.append(button);
    }

    #startCompetition(countries, stages) {
        try {
            this.#controller.startCompetition(countries, stages);
        } catch (error) {
            alert(error);
            return false;
        }
        return true;
    }

    #endCompetition() {
        try {
            this.#controller.endCompetition();
        } catch (error) {
            alert(error);
            return false;
        }
        return true;
    }

    #buttonClick1() {
        //read values from input
        const countries = document.getElementById('countries').value;
        const stages = document.getElementById('stages').value;
        if(this.#startCompetition(countries, stages)) {
            //remove lap1 button
            document.getElementById('startCompetitionButton').remove();
            //display lap1 results
            this.#displayResults(this.#controller.getLap1Data(), 1);
            //add lap2 button
            const button = document.createElement('button');
            button.innerText = 'Начать 2й раунд!';
            button.id = 'endCompetitionButton';
            button.onclick = () => this.#buttonClick2();
            this.#container.append(button);
        }
    }

    #buttonClick2() {
        if(this.#endCompetition()) {
            //remove lap2 button
            document.getElementById('endCompetitionButton').remove();
            const results = this.#controller.getLap2Data()
            //display lap2 results
            this.#displayResults(results, 2);
            //display winners
            this.#displayWinners(results);
            //add restart button
            const button = document.createElement('button');
            button.innerText = 'Еще раз?';
            button.id = 'restartButton';
            button.onclick = () => this.#buttonClick3();
            this.#container.append(button);
        }
    }

    #buttonClick3() {
        this.#container.innerText = '';
        this.init();
    }

    #displayResults(rating, lap) {
        let element;
        element = document.createElement('h2');
        element.innerHTML = 'Результаты круга ' + lap + ':';
        this.#container.append(element);
        element = document.createElement('h3');
        element.innerHTML = 'Рейтинг стран:';
        this.#container.append(element);
        for (let ratingRecord of rating.countries) {
            let str = "" + ratingRecord.place + ". cтрана " + ratingRecord.id + " " + ratingRecord.name
                + " Сумма мест на всех этапах: " + ratingRecord.placeSum;
            if (lap == 1) {
                str += " Места участников: " + ratingRecord.contestantPlaces;
            } else {
                str += " Среднее место участников: " + ratingRecord.meanPlace;
            }
            element = document.createElement('div');
            if(lap == 1 && ratingRecord.place <= 4) {
                element.innerHTML = '<strong>' + str + '</strong>';
            } else {
                element.innerHTML = str;
            }
            this.#container.append(element);
        }
        element = document.createElement('h3');
        element.innerHTML = 'Рейтинг участников:';
        this.#container.append(element);
        for (let ratingRecord of rating.contestants) {
            let str = ratingRecord.place + ". участник " + ratingRecord.id + " "
                + ratingRecord.surname + " " + ratingRecord.name + " Время всего круга: " + ratingRecord.lapSum;
            element = document.createElement('div');
            element.innerHTML = str;
            this.#container.append(element);
        }
    }
    #displayWinners(rating) {
        const div = document.createElement('div');
        div.id = 'winners';
        let element;
        element = document.createElement('h2');
        element.innerHTML = 'Победители:';
        div.appendChild(element);
        element = document.createElement('div');
        element.innerHTML = '<strong>Страна: ' + rating.countries[0].name + '</strong>';
        div.appendChild(element);
        element = document.createElement('div');
        element.innerHTML = '<strong>Участник: ' + rating.contestants[0].surname + ' ' + rating.contestants[0].name + '</strong>';
        div.appendChild(element);
        this.#container.append(div);
    }
}