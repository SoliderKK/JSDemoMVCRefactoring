class CompetitionController {
    #ratingTracker;
    startCompetition(countries, stages) {
        //validate
        if(isNaN(countries) || isNaN(stages) || countries <= 0 || countries > 100 || stages < 2 || stages > 100) {
            throw new Error('Invalid input');
        }
        this.#ratingTracker = new RatingTracker(countries, stages);
        this.#ratingTracker.doLap1();
    }
    endCompetition() {
        this.#ratingTracker.doLap2();
    }
    getLap1Data() {
        return this.#ratingTracker.getLap1Data();
    }
    getLap2Data() {
        return this.#ratingTracker.getLap2Data();
    }

}